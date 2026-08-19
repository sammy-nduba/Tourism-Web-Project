# Complete HostAfrica Deployment Guide (Frontend & Backend)

Hosting everything on HostAfrica is a great choice as it simplifies your architecture and keeps everything under one roof! HostAfrica uses cPanel, which comes with a **"Setup Node.js App"** feature.

Here is the step-by-step guide to hosting your Node.js backend and React frontend entirely on HostAfrica.

---

## Part 1: Prepare and Upload the Backend

Your backend is written in TypeScript, so it must be compiled into JavaScript before it can run on HostAfrica.

### 1. Build the Backend Locally
1. Open your terminal and navigate to your `Backend` folder.
2. Run the build command:
   ```bash
   npm run build
   ```
   *This creates a `dist` folder containing the compiled JavaScript code.*

### 2. Prepare the Files for Upload
You need to create a zip file containing ONLY the files needed for production. Zip the following items from the `Backend` folder:
- The `dist/` folder
- `package.json`
- `package-lock.json`
- `.env`

*(Do NOT include the `node_modules` or `src` folder to save upload time).*

### 3. Upload to HostAfrica cPanel
1. Log in to your HostAfrica **cPanel**.
2. Open the **File Manager**.
3. In your home directory (outside of `public_html`), create a new folder named `backend`.
   *(Path should look like `/home/yourusername/backend`)*.
4. Upload your zip file into this `backend` folder and **Extract** it.

---

## Part 2: Configure the Node.js App in cPanel

1. Go back to the main cPanel dashboard and look for **Setup Node.js App** (usually under the Software section).
2. Click **Create Application**.
3. Fill in the details:
   - **Node.js version:** Select `20.x` or the latest LTS available.
   - **Application mode:** `Production`
   - **Application root:** `backend` *(This is the folder you just created)*.
   - **Application URL:** `api` *(This means your backend will be accessible at yourdomain.com/api)*.
   - **Application startup file:** `dist/index.js`
4. Click **Create**.
5. Once created, you will see a section for Environment Variables. Make sure your `DATABASE_URL` is correct. Because the database is now on the same server, you can use `localhost`:
   - Name: `DATABASE_URL` 
   - Value: `mysql://davikith_tours:Davikith2026!@localhost:3306/davikith_tours`
   - Name: `FRONTEND_URL`
   - Value: `https://your-domain.com`
6. Scroll down to the bottom and click the **Run NPM Install** button. This will install all production dependencies reading from your `package.json`.
7. Once installation finishes, click the **Restart** button at the top.

*Your backend API is now running at `https://your-domain.com/api`!*

---

## Part 3: Deploy the Frontends (Main Site & Admin Panel)

Now that your API lives at `your-domain.com/api`, you need to configure your frontends (both `Frontend` and `Admin`) to point there before building them. We have already updated both codebases to automatically point to `/api` when deployed!

### 1. Build Both Frontends Locally
1. Navigate to your `Frontend` folder locally.
2. Run the build command:
   ```bash
   npm run build
   ```
   *This creates a `dist` folder inside your `Frontend` directory.*
3. Navigate to your `Admin` folder locally.
4. Run the build command:
   ```bash
   npm run build
   ```
   *This creates a `dist` folder inside your `Admin` directory.*

### 2. Upload to HostAfrica cPanel
1. In the HostAfrica cPanel **File Manager**, navigate to the `public_html` folder.
2. Upload and extract the contents of your **`Frontend`'s** `dist` folder directly into `public_html`.
3. In `public_html`, create a new folder named `admin`.
4. Upload and extract the contents of your **`Admin`'s** `dist` folder into `public_html/admin`.

### 3. Handle React Routing (.htaccess)
To ensure that page refreshes on pages like `/tours` or `/admin/dashboard` don't result in a 404 error, you need to set up an `.htaccess` file.
Because your API is hosted under `/api`, we must tell Apache to ignore `/api` traffic so it passes through to your Node.js app!

1. In `public_html`, create or edit the `.htaccess` file.
2. Paste the following configuration exactly:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # DO NOT rewrite API requests, let them pass to Node.js backend
  RewriteCond %{REQUEST_URI} ^/api [NC]
  RewriteRule ^ - [L]

  # Route /admin/* requests to /admin/index.html
  RewriteCond %{REQUEST_URI} ^/admin [NC]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /admin/index.html [L]

  # Redirect all other frontend routes to index.html
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```
3. **Save Changes**.

---

## 4. Final Verification
1. Visit `https://your-domain.com/api/health` — You should see a JSON message saying the API is running!
2. Visit `https://your-domain.com` — Your frontend should load seamlessly and communicate with the backend. 

You now have a fully self-hosted, full-stack application on HostAfrica!
