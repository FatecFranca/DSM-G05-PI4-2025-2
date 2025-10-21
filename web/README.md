# Condo Access Control System

This project is a web application for managing access control in condominiums. It provides a user-friendly interface for administrators and residents to manage visitors, vehicles, and user accounts.

## Features

- **User Authentication**: Secure login for users with role-based access control.
- **Dashboard**: A central hub for users to access various functionalities.
- **Visitor Management**: Easily manage visitor entries and exits.
- **Vehicle Management**: Keep track of vehicles associated with residents.
- **User Management**: Admins can manage user accounts and permissions.
- **Settings**: Configure application settings as needed.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A build tool that provides a fast development environment.
- **Axios**: A promise-based HTTP client for making API requests.
- **CSS**: For styling the application.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd condo-access-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000` to view the application.

## API Integration

This application communicates with a RESTful API for backend operations. Ensure that the API is running and accessible at the specified base URL in the `src/services/api.js` file.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.