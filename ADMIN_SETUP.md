# Admin Panel Setup

## Setting Up the Admin Password

The admin panel uses a secure password hash stored in environment variables. Here's how to set it up:

### 1. Create Environment File

Create a `.env.local` file in the root directory with your password hash:

```bash
VITE_ADMIN_PASSWORD_HASH=your_password_hash_here
```

### 2. Generate Password Hash

To generate a hash for your password, you can use the browser console or a Node.js script:

**Browser Console Method:**

1. Open your browser's developer console
2. Run this code (replace "your_password" with your actual password):

```javascript
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

hashPassword("your_password").then((hash) => console.log(hash));
```

**Node.js Method:**

```bash
node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('your_password').digest('hex'));"
```

### 3. Update Environment File

Copy the generated hash and update your `.env.local` file:

```
VITE_ADMIN_PASSWORD_HASH=generated_hash_here
```

### 4. Restart Development Server

After updating the environment file, restart your development server:

```bash
npm run dev
```

## Security Notes

- The `.env.local` file is already in `.gitignore` and won't be committed to version control
- The password is never stored in plain text in the code
- The hash is compared securely using SHA-256
- Sessions expire after 24 hours for additional security

## Accessing the Admin Panel

1. Navigate to `/admin-login` or click the keyboard icon in the navigation
2. Enter your password
3. You'll be redirected to the admin panel at `/admin`
4. Use the logout button to end your session

## Security Note

**Important:** Set up your own secure password immediately after installation!

Here’s how you can set your admin password:

1. **Choose your password** (for example: `your_secure_password`).
2. **Generate the hash** using one of the methods above.

3. **Create a file called `.env.local` in your project root** (if it doesn’t exist).
4. **Add your hash to `.env.local`:**

```
VITE_ADMIN_PASSWORD_HASH=your_generated_hash_here
```

5. **Restart your dev server** (`npm run dev`).

Now your admin password is set to your chosen password.  
If you want a different password, just tell me what you want and I’ll generate the hash for you!

If you’re seeing an error after setting up your admin password, please provide the exact error message or describe what’s happening (e.g., “login fails,” “server won’t start,” etc.).

**Common issues and quick checks:**

1. **.env.local file location:**  
   Make sure `.env.local` is in your project root (same level as `package.json`).

2. **No extra spaces:**  
   The line in `.env.local` should be:

   ```
   VITE_ADMIN_PASSWORD_HASH=your_generated_hash_here
   ```

   (No quotes, no extra spaces.)

3. **Restart dev server:**  
   After editing `.env.local`, you must restart your dev server (`npm run dev`).

4. **Login with your password:**  
   Use the password you set up.

5. **Vite environment variable prefix:**  
   The variable must start with `VITE_` for Vite to expose it to the frontend.

---

**If you provide the error message or describe what you see, I can give you a precise fix!**
