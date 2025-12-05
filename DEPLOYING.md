# Deploying Your Application

This application is configured to be deployed using [Firebase App Hosting](https://firebase.google.com/docs/hosting/app-hosting). App Hosting provides a secure, fully-managed, serverless environment for running your web app.

The deployment process is managed through your source control provider (e.g., GitHub). Once connected, App Hosting will automatically build and deploy new versions of your application whenever you push changes to your main branch.

## Deployment Steps

### 1. Push to a Git Repository

Before you can deploy, your application code needs to be in a source control repository.

- **If you don't have one:** Create a new repository on [GitHub](https://github.com/new), [GitLab](https://gitlab.com/projects/new), or [Bitbucket](https://bitbucket.org/repo/create).
- **Push your code:** Follow the instructions from your Git provider to push your local project code to the new repository.

```bash
# Example commands for a new GitHub repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 2. Connect to Firebase App Hosting

1.  **Open the Firebase Console:** Navigate to the [Firebase Console](https://console.firebase.google.com/) and select your project (`studio-658202948-c3764`).

2.  **Go to App Hosting:** In the left-hand navigation menu under the "Build" section, click on **App Hosting**.

3.  **Create a Backend:** If you don't have one already, click "Create backend".

4.  **Connect Your Repository:**
    - You will be prompted to connect your source control provider (e.g., GitHub).
    - Follow the authentication flow and grant Firebase access to your repositories.
    - Select the repository containing your application code.

5.  **Configure Deployment Settings:**
    - **Root Directory:** Leave this as `/`.
    - **Live Branch:** Set this to your main branch (e.g., `main`).
    - App Hosting will automatically detect that this is a Next.js application and use the appropriate build (`npm run build`) and start (`npm run start`) commands defined in `package.json`.

### 3. Automatic Deployments

Once your repository is connected, Firebase App Hosting will automatically trigger a new build and deployment every time you push a commit to your designated live branch.

You can monitor the status of your deployments from the App Hosting dashboard in the Firebase Console. After the first deployment is complete, your application will be live at the URL provided by Firebase.
