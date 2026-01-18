# Beginner's Guide to Deploying Your Website on AWS

Welcome! This guide will take you through the process of putting your website on the internet step-by-step.

**The Strategy:**
To make everything work smoothly, we need to do things in a specific order:
1.  **Database & Backend** (so your form has somewhere to send data).
2.  **Update Code** (connect your website to the backend).
3.  **S3 Hosting** (put your website on the internet).

---

## Phase 1: The Backend (Engine Room)

Before hosting the visual part (S3), we need to make sure the form works.

### Step 1: Create the Database (DynamoDB)
*This is where user details will be saved.*
1.  Log in to the **AWS Console**.
2.  Search for **DynamoDB** and click **Create table**.
3.  **Table name**: `UserDetails`
4.  **Partition key**: Type `id` (and select **String**).
5.  Leave everything else as default and click **Create table**.

### Step 2: Create the Function (Lambda)
*This is the code that catches the form data.*
1.  Search for **Lambda** and click **Create function**.
2.  Select **Author from scratch**.
3.  **Function name**: `SubmitFormFunction`
4.  **Runtime**: `Node.js 20.x` (or latest).
5.  Click **Create function**.
6.  **The Code**:
    *   Scroll down to the **Code source** section.
    *   Open `backend/lambdafunc.js` on your computer.
    *   Copy the *entire* content.
    *   Paste it into the Lambda code editor (replace existing code).
    *   Click **Deploy**.
7.  **Permissions** (Crucial Step!):
    *   Go to the **Configuration** tab -> **Permissions**.
    *   Click the Role name (it looks like `SubmitFormFunction-role-xxxxx`).
    *   In the new tab (IAM), click **Add permissions** -> **Attach policies**.
    *   Search for `AmazonDynamoDBFullAccess` (easier for beginners) and check it.
    *   Click **Add permissions**.

### Step 3: Create the Doorway (API Gateway)
*This gives your function a URL web address.*
1.  Search for **API Gateway**.
2.  Click **Create API** -> **REST API** -> **Build**.
3.  **API Name**: `FormAPI` -> **Create API**.
4.  **Create Resource**:
    *   Click **Actions** -> **Create Resource**.
    *   Resource Name: `submit`.
    *   Click **Create Resource**.
5.  **Create Method**:
    *   With `/submit` selected, Click **Actions** -> **Create Method**.
    *   Select **POST** -> Click Checkmark.
    *   **Integration type**: Lambda Function.
    *   **Lambda Function**: `SubmitFormFunction`.
    *   Click **Save**.
6.  **Enable CORS** (Crucial for Web Browser Access):
    *   *Why?* Web browsers block websites from sending data to a *different* website (your API) for security. CORS tells the browser "It's okay, let this website talk to me."
    *   **Select the Resource**: Click on the `/submit` resource (the folder icon, not the POST method itself).
    *   **Find the Button**: Click the **Actions** dropdown button (usually at the very top of the list of resources/methods).
    *   **Select Option**: Choose **Enable CORS** from the list.
    *   **Settings**: A new screen appears.
        *   leave "Gateway Responses" checked.
        *   "Access-Control-Allow-Origin" should say `'*'` (this means ANY website can send data).
    *   **Confirm**: Click the blue button **Enable CORS and replace existing CORS headers**.
    *   **Final Pop-up**: A confirmation box will appear asking "Are you sure?". Click **Yes, replace existing values**. You will see a bunch of green checkmarks appear.
7.  **Deploy**:
    *   Click **Actions** -> **Deploy API**.
    *   **Stage name**: `prod`.
    *   Click **Deploy**.
8.  **Copy the URL**:
    *   Look for **Invoke URL** at the top.
    *   It looks like: `https://xyz123.execute-api.us-east-1.amazonaws.com/prod`
    *   **Write this down!**

---

## Phase 2: Connecting the Wires

Now we connect your local code to the live AWS backend.

1.  Open the file `frontend/script.js` on your computer.
2.  Find line 6: `const API_URL = 'YOUR_API_GATEWAY_URL_HERE';`
3.  Replace `'YOUR_API_GATEWAY_URL_HERE'` with the **Invoke URL** you just copied from API Gateway.
    *   *Important*: Add `/submit` to the end of the URL.
    *   Example: `const API_URL = 'https://xyz.amazonaws.com/prod/submit';`
4.  Save the file.

---

## Phase 3: Hosting on S3 (The Website)

Now that the code works, let's put it on the internet using an S3 Bucket.

### Step 1: Create Bucket
1.  Search for **S3** and click **Create bucket**.
2.  **Bucket name**: `my-unique-form-app-1234` (must be globally unique).
3.  **Object Ownership**: Select **ACLs enabled**.
4.  **Block Public Access settings**:
    *   **Uncheck** "Block all public access".
    *   Check the warning box "I acknowledge that...".
5.  Click **Create bucket**.

### Step 2: Upload Files
1.  Click on your new bucket name.
2.  Click **Upload**.
3.  Drag and drop these 3 files from your `frontend` folder:
    *   `index.html`
    *   `style.css`
    *   `script.js`
4.  Click **Upload**.

### Step 3: Make it Public (Static Website Hosting)
1.  Go to the **Properties** tab of your bucket.
2.  Scroll to the very bottom: **Static website hosting**.
3.  Click **Edit**.
4.  Select **Enable**.
5.  **Index document**: `index.html`.
6.  Click **Save changes**.

### Step 4: Final Permissions
1.  Go to the **Objects** tab.
2.  Select all 3 files you uploaded.
3.  Click **Actions** -> **Make public using ACL**.
4.  Click **Make public**.

### Step 5: Visit Your Site!
1.  Go back to **Properties** -> **Static website hosting**.
2.  Click the **Bucket website endpoint** link.
3.  Your site is live! Fill out the form and hit Submit.

---

**You're Done!** 🎉
You have built and deployed a full serverless application.
