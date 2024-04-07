## Live Demo

The live website can be viewed at [dcard-blog-five.vercel.app](https://dcard-blog-five.vercel.app)

## Project Setup: Getting Started

Let's get your development environment ready to work on this project. Here's what you'll need to do:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/willidragon/dcard-blog.git
   ```

1. **Install dependencies:**
   ```bash
   npm install
   ```
1. **Create a GitHub OAuth App:**

   - Head over to [https://github.com/settings/applications/new](https://github.com/settings/applications/new) and create an app. This allows your project to communicate with GitHub's API.
   - **Important Settings:**
     - **Homepage URL:** `http://localhost:3000` (or your eventual deployment URL)
     - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github` (or your deployment URL)
   - Grab your newly generated **Client ID** and **Client Secret**.

1. **Environment Variables:**

   - Create a `.env.local` file at the root of your project.
   - Add these lines, replacing placeholders with your actual values:

     ```bash
     GITHUB_CLIENT_ID=your_client_id
     GITHUB_CLIENT_SECRET=your_client_secret
     NEXTAUTH_URL=http://localhost:3000  # Or your deployment URL
     NEXTAUTH_SECRET=your_generated_secret  # See below
     GITHUB_OWNER=your_repository_owner
     GITHUB_REPO=your_repository_name
     ```

1. **NextAuth.js Secret:**

   - Generate a secure key for NextAuth.js by running this in your terminal:
     ```bash
     openssl rand -base64 32
     ```
   - Paste the output into your `.env.local` file for the `NEXTAUTH_SECRET` variable.

1. **Targeting the Issues:**
   - In your `.env.local` file, make sure the `GITHUB_OWNER` and `GITHUB_REPO` variables point to the repository where you'll be fetching issues from.

## Running the Project

- **Development Mode:**

  - To start the development server, run the following command:
    ```bash
    npm run dev
    ```
  - This will typically open your project in a browser window (e.g., at http://localhost:3000).

- **Production Build:**

  - To create an optimized production build of your project, run:
    ```bash
    npm run build
    ```

- **Starting the Production Build:**
  - Once you have a production build, you can serve it with:
    ```bash
    npm run start
    ```

**功能:**

- [ ] GitHub Login
  - [ ] 串接 GitHub OAuth,讓使用者有權限操作 GitHub API
  - [ ] 詳見 [GitHub OAuth documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow)
  - [ ] 注意:在登入時需要求正確的 scope
- [ ] Post Management
  - [ ] 將 GitHub Issue 作為 Post,以 GitHub Issue 實作, 並將 close Issue 視為刪除 Post
- [ ] User Interface
  - [ ] 列表頁
    - [ ] 第一次只能載入 10 筆
    - [ ] 每當列表滾到底部時要需要自動發送 API 請求,並載入額外 10 筆,直到沒有更多文章
  - [ ] 文章頁
    - [ ] 顯示文章內容,並正確 render 出 markdown 的內容
    - [ ] 使用者可以在此「編輯」、「刪除」
  - [ ] 新增/編輯文章時,可以使用 Modal 或跳轉至新的頁面操作
    - [ ] 至少需要使用 title 和 body 兩個欄位
    - [ ] 表單驗證: title 為必填, body 至少需要 30 字

**加分條件:**

- [ ] 使用 TypeScript
- [ ] 使用 Next.js + App Router
- [ ] 調校 Web Vitals 評分
- [ ] 有處理錯誤及例外狀況(Error Handling)
- [ ] 有部署至線上環境
