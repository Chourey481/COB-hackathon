# Sign2Speak - Interactive Sign Language Learning Platform

Sign2Speak is a web-based platform that helps users learn and practice sign language using real-time hand gesture recognition. The application features both learning and testing modes, making it an engaging tool for mastering sign language.

## Features

- **Learning Mode**: Sequential learning from A to Z with visual guidance
- **Testing Mode**: Practice mode with random letter challenges
- **Real-time Recognition**: Instant feedback on hand gestures
- **Progress Tracking**: Monitor your learning journey
- **User-friendly Interface**: Clean and intuitive design

## Prerequisites

- Python 3.8 or higher
- Webcam access
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sign2speak
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Ensure you have the gesture recognition model:
- Place your trained model file (`gesture_model.pkl`) in the `backend/model/` directory

## Project Structure

```
sign2speak/
├── backend/
│   ├── main.py                  # FastAPI application
│   └── model/
│       └── gesture_model.pkl    # Trained CNN model
├── frontend/
│   ├── index.html              # Home page
│   ├── learn.html              # Learning mode interface
│   ├── test.html               # Testing mode interface
│   ├── script.js               # Frontend logic
│   └── styles.css              # Styling
├── static/
│   └── signs/                  # Sign language images
└── requirements.txt            # Python dependencies
```

## Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

2. Open the frontend:
- Navigate to the `frontend` directory
- Open `index.html` in your web browser
- Or serve the frontend files using a local server

## Usage

1. **Learning Mode**:
   - Start from letter A
   - Follow the displayed sign image
   - Practice the gesture
   - Submit when ready
   - Progress through all letters

2. **Testing Mode**:
   - Random letters will be displayed
   - Show the corresponding sign
   - Get immediate feedback
   - Track your accuracy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.