# API Gateway Configuration Guide

## 1. Create API
1.  Go to the **API Gateway** console.
2.  Click **Create API**.
3.  Choose **REST API** (not HTTP API, for better control over CORS/Models in this specific example, though HTTP API works too. We'll use REST as requested).
4.  Select **New API**.
5.  **API Name**: `UserDetailsAPI`.
6.  Click **Create API**.

## 2. Create Resource
1.  Select the root `/`.
2.  Click **Actions** -> **Create Resource**.
3.  **Resource Name**: `submit`.
4.  **Resource Path**: `submit`.
5.  Click **Create Resource**.

## 3. Create Method
1.  Select the `/submit` resource.
2.  Click **Actions** -> **Create Method**.
3.  Select **POST** and click the checkmark.
4.  **Integration type**: `Lambda Function`.
5.  **Use Lambda Proxy integration**: **CHECK THIS BOX** (Critical for parsing body in Lambda).
6.  **Lambda Function**: Enter the name of the function you created (e.g., `SubmitUserDetails`).
7.  Click **Save** and grant permissions.

## 4. Enable CORS
1.  Select the `/submit` resource.
2.  Click **Actions** -> **Enable CORS**.
3.  **Access-Control-Allow-Methods**: Select POST and OPTIONS.
4.  **Access-Control-Allow-Origin**: `*` (or your specific S3 bucket URL).
5.  Click **Enable CORS and replace existing CORS headers**.
6.  Confirm the changes.

## 5. Deploy API
1.  Click **Actions** -> **Deploy API**.
2.  **Deployment stage**: [New Stage].
3.  **Stage name**: `dev` (or `prod`).
4.  Click **Deploy**.

## 6. Get Endpoint URL
1.  After deployment, you will see the **Invoke URL** at the top (e.g., `https://xyz.execute-api.us-east-1.amazonaws.com/dev`).
2.  Your full endpoint is: `INVOKE_URL/submit`.
3.  **UPDATE** this URL in your `script.js` file (replace `YOUR_API_GATEWAY_URL_HERE`).
