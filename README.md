# DocuPop

A modern document management and OCR processing platform built with Next.js 16+, PostgreSQL, and Tesseract OCR.

## Overview

DocuPop allows users to upload, organize, and process documents with intelligent OCR extraction. Documents can be automatically parsed into structured data tables with customizable field mappings, making it easy to extract and manage information from invoices, receipts, forms, and other documents.

## Features

- **Document Management**: Upload, view, download, and delete documents
- **Secure Authentication**: Cookie-based authentication with PostgreSQL user storage
- **OCR Processing**: Extract text and structured data from documents using Tesseract OCR
- **Data Tables**: Create custom tables with field definitions for organizing extracted data
- **Field Mapping**: Define smart mappings between OCR labels and table fields
- **Batch Processing**: Queue multiple documents for OCR processing
- **Real-time Updates**: Live status updates for processing jobs
- **Export Data**: Download extracted data as CSV

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- AG Grid for data tables
- Sonner for notifications

**Backend:**
- Next.js API Routes
- PostgreSQL database
- Node.js pg driver
- Cookie-based sessions

**OCR Worker:**
- Python 3.8+
- Tesseract OCR
- Poppler (PDF processing)
- pytesseract

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Python** 3.8 or higher ([Download](https://www.python.org/downloads/))
- **Tesseract OCR** ([Installation Guide](https://github.com/tesseract-ocr/tesseract))

### Installing Tesseract OCR

**Windows:**
1. Download the installer from [GitHub Releases](https://github.com/UB-Mannheim/tesseract/wiki)
2. Run the installer and note the installation path (usually `C:\Program Files\Tesseract-OCR`)

**macOS:**
```bash
brew install tesseract
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install tesseract-ocr
```

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd docupop
npm install
```

### 2. Start PostgreSQL Database

Using Docker:

```bash
docker run --name docupop-db \
  -e POSTGRES_USER=docupop \
  -e POSTGRES_PASSWORD=docupop \
  -e POSTGRES_DB=docupop \
  -p 5432:5432 \
  -d postgres:16
```

### 3. Configure Environment

Create `.env.local` in the root directory:

```env
# Database Configuration
PGHOST=localhost
PGPORT=5432
PGUSER=docupop
PGPASSWORD=docupop
PGDATABASE=docupop

# Authentication
LOCAL_AUTH_SECRET=docupop-local-secret

# API Configuration
NEXT_PUBLIC_LOCAL_API_BASE=http://localhost:3000

# Processing Worker
PROCESSING_WORKER_TOKEN=dev-worker-token
```

### 4. Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Login

Use the demo account that's automatically created:
- **Email:** `demo@docupop.local`
- **Password:** `password123`

### 6. (Optional) Start the OCR Worker

For document processing functionality:

```bash
cd services/ocr-worker
pip install -r requirements.txt
python worker.py
```

Configure the worker by creating `services/ocr-worker/.env`:

```env
PROCESSING_API_BASE=http://localhost:3000/api
PROCESSING_WORKER_TOKEN=dev-worker-token
PROCESSING_POLL_INTERVAL=5
TESSERACT_CMD=/usr/local/bin/tesseract  # optional if on PATH
```

## Project Structure

```
docupop/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints (auth, documents, processing, data)
│   ├── documents/         # Documents management page
│   ├── upload/            # Upload page
│   ├── data/              # Data tables page
│   ├── processing/        # Processing jobs page
│   ├── layout.tsx         # Root layout with auth provider
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── auth/             # Authentication forms
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   └── AuthProvider.tsx  # Authentication context provider
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   ├── utils.ts          # Utility functions
│   └── auth-service.ts   # Client-side auth service
├── server/                # Server-side logic
│   ├── auth/             # Authentication and session management
│   │   ├── session.ts    # Session cookie handling
│   │   └── db.ts         # Database connection
│   ├── data-store.ts     # Document and user management
│   ├── data-tables.ts    # Data table operations
│   └── processing-store.ts # Processing job management
├── services/
│   └── ocr-worker/       # Python OCR worker
│       ├── worker.py     # Main worker script
│       └── requirements.txt
├── local-data/            # Local file storage
│   └── uploads/          # Uploaded document files
└── public/                # Static assets

```

## Features in Detail

### Document Management
- Upload documents (PDF, images, text files)
- View document list with metadata
- Download original files
- Delete unwanted documents
- Automatic file validation and size limits

### OCR Processing
- Queue documents for OCR extraction
- Choose target data table for extracted data
- Real-time job status updates
- Confidence scoring for extractions
- Error handling and retry logic

### Data Tables
- Create custom tables with field definitions
- Define field types (text, number, date, etc.)
- Import CSV data
- Edit rows inline with AG Grid
- Export data as CSV
- Delete tables and rows

### Field Mappings
- Map OCR labels to table fields
- Define matching patterns for intelligent extraction
- Automatic row creation from OCR results
- Document name tracking per row

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Documents
- `GET /api/documents` - List user's documents
- `POST /api/documents` - Upload a document
- `GET /api/documents/[id]` - Get document metadata
- `GET /api/documents/[id]/download` - Download document file
- `DELETE /api/documents/[id]` - Delete a document

### Processing
- `GET /api/processing` - List processing jobs
- `POST /api/processing` - Queue documents for processing
- `GET /api/processing/claim` - Worker endpoint to claim job
- `POST /api/processing/[id]/complete` - Worker endpoint to complete job
- `POST /api/processing/[id]/fail` - Worker endpoint to mark job as failed

### Data Tables
- `GET /api/data/tables` - List all tables
- `POST /api/data/tables` - Create a new table
- `GET /api/data/tables/[id]` - Get table details
- `PATCH /api/data/tables/[id]` - Update table metadata
- `DELETE /api/data/tables/[id]` - Delete a table
- `GET /api/data/tables/[id]/rows` - Get table rows
- `POST /api/data/tables/[id]/rows` - Add rows
- `PATCH /api/data/tables/[id]/rows/[rowId]` - Update a row
- `DELETE /api/data/tables/[id]/rows/[rowId]` - Delete a row
- `POST /api/data/tables/[id]/import` - Import CSV
- `GET /api/data/tables/[id]/export` - Export as CSV
- `GET /api/data/tables/[id]/mappings` - Get field mappings
- `POST /api/data/tables/[id]/mappings` - Create field mapping
- `DELETE /api/data/tables/[id]/mappings/[mappingId]` - Delete mapping

## Database Schema

The application auto-creates tables on first run:

- **users** - User accounts
- **documents** - Document metadata
- **processing_jobs** - OCR processing queue
- **data_tables** - Custom data table definitions
- **data_fields** - Field definitions for tables
- **data_rows** - Actual data rows
- **field_mappings** - OCR label to field mappings

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Database Management

Access the database directly:
```bash
docker exec -it docupop-db psql -U docupop -d docupop
```

Reset the database:
```bash
docker stop docupop-db
docker rm docupop-db
# Then run the docker run command again
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps | grep docupop-db

# Start if not running
docker start docupop-db
```

### Tesseract Not Found
1. Verify installation: `tesseract --version`
2. Update `TESSERACT_CMD` in `services/ocr-worker/.env`
3. Restart the worker

### Worker Can't Connect
1. Ensure Next.js dev server is running
2. Verify `PROCESSING_API_BASE` and `PROCESSING_WORKER_TOKEN` match in both `.env.local` and `services/ocr-worker/.env`

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
