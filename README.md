# Listinator

A simple web-based list management application perfect for shopping lists, to-do lists, or any kind of item tracking. Built with Go and featuring a clean, intuitive interface.

## Features

- Web interface for managing shopping lists and to-do lists
- Mark items as bought/completed
- Search functionality
- Docker support

## Requirements

- Go 1.24.3 or later

## Installation

### Option 1: Build from Source

1. Clone the repository:
```bash
git clone https://github.com/hacky-day/listinator.git
cd listinator
```

2. Build the application:
```bash
go build .
```

3. Set the database directory environment variable:
```bash
export LISTINATOR_DATABASE_DIR=/path/to/your/data/directory
```

4. Run the application:
```bash
./listinator
```

### Option 2: Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/hacky-day/listinator.git
cd listinator
```

2. Run with docker-compose:
```bash
docker-compose up
```

This will:
- Build and start the application
- Map port 8080 to your host  
- Create a persistent volume for data storage in `./data`

You can also run with Docker directly:
```bash
docker run -p 8080:8080 -v $(pwd)/data:/var/lib/listinator -e LISTINATOR_DATABASE_DIR=/var/lib/listinator ghcr.io/hacky-day/listinator:latest
```

The application will be available at http://localhost:8080

## Development

### Project Structure

- `main.go` - Application entry point and server setup
- `server/` - HTTP handlers and API routes
- `database/` - Database models and initialization
- `frontend/` - Static web assets (HTML, CSS, JavaScript)

### Development Setup

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/hacky-day/listinator.git
cd listinator
go mod download
```

2. For development, the application will serve static files from the `frontend/` directory instead of embedded files.

3. Set environment variables:
```bash
export LISTINATOR_DATABASE_DIR=./data
```

4. Run the development server:
```bash
go run .
```

## Configuration

The application uses the following environment variables:

- `LISTINATOR_DATABASE_DIR` - Directory where the SQLite database file will be stored (required)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Support

If you encounter any issues or have questions, please open an issue on GitHub.