# Beginner's Guide to Deploying Your Website on AWS

Welcome! This guide will take you through the process of putting your website on the internet step-by-step.

**The Strategy:**
To make everything work smoothly, we need to do things in a specific order:
1.  **Database & Backend** (so your form has somewhere to send data).
2.  **Update Code** (connect your website to the backend).
3.  **S3 Hosting** (put your website on the internet).

---
<img width="1024" height="1536" alt="ChatGPT Image Jan 19, 2026, 06_48_19 PM" src="https://github.com/user-attachments/assets/bd8645bf-5e92-4fe6-8282-388cd32fe534" />

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

# Website Hosting on AWS S3 with CloudFront

This guide explains how to host a static portfolio website on AWS S3 and distribute it via CloudFront for enhanced performance and security.

---

## Step 1: Create an S3 Bucket

1. Go to the **S3** console and create a new bucket.
2. Configure the following settings:
   - **Enable ACL**
   - **Disable Block Public Access**
   - **Enable Versioning**

---

## Step 2: Upload Files

1. Upload your portfolio files and folders to the S3 bucket.
2. Set permissions to **public** so that the content is accessible over the web.

---

## Step 3: Enable Static Website Hosting

1. Go to the **Properties** tab of your S3 bucket.
2. Enable **Static Website Hosting**.
3. Set the **index document** to `index.html`.

---

## Step 4: Configure CloudFront Distribution

1. Go to the **CloudFront** console and create a new distribution.
2. Configure the distribution settings:
   - **Name**: Give a descriptive name
   - **Website/App Type**: Single website or application
   - **Origin Domain**: Select your S3 bucket web endpoint
   - **Origin Settings**: Choose the S3 bucket created in Step 1
   - **Redirect HTTP to HTTPS** for secure access
   - **Enable WAF Security Protections** for additional security
   -  **Use domain as shown in ACM** for access
   - **Add Subdomain** for access. Ex: www
   - **Default Root Object**: `index.html`

---

## Notes

- Ensure that your S3 bucket policy allows **public read** access.
- Use **AWS Certificate Manager (ACM)** to attach SSL certificates for HTTPS.
- Versioning on the bucket helps manage updates and rollback if needed.

---

Your website is now hosted on S3 and distributed securely via CloudFront!
---

**You're Done!** 🎉
You have built and deployed a full serverless application.
