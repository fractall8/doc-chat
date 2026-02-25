# Doc-Chat

Doc-Chat is a full-stack AI-powered SaaS application that allows users to upload PDF documents and engage in natural language conversations with them. By leveraging Retrieval-Augmented Generation (RAG), the application extracts text from documents, vectorizes it, and uses LLMs to provide accurate, context-aware answers based strictly on the uploaded files.

## 🛠 Tech Stack

### Core & Frontend
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS & Shadcn UI
* **PDF Rendering:** react-pdf

### Backend & API
* **API Layer:** tRPC (for end-to-end typesafe APIs)
* **Database:** MySQL
* **ORM:** Prisma
* **Authentication:** NextAuth.js (with Prisma Adapter)
* **File Storage:** UploadThing

### AI & Machine Learning
* **LLM Provider:** OpenAI API (via `@ai-sdk/openai`)
* **Vector Database:** Pinecone
* **Framework:** LangChain (for document processing and embeddings)

## 🚀 Key Features
* **Authentication:** Secure user login and session management via NextAuth.
* **PDF Processing:** Seamless PDF uploading using UploadThing, with background text extraction.
* **Vector Search:** Documents are chunked and stored in Pinecone for fast semantic search.
* **Interactive Chat:** Real-time, streaming AI chat interface synchronized with the document viewer.
* **Upload Status Tracking:** Real-time UI updates for file processing states (Pending, Processing, Success, Failed).
