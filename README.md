# GridPhone
>The worst UI phone number selector on the market.

## Description
This is a project for my ICS4U class based around the 'worst UI/UX' trend ([source](https://userinyerface.com/)). The user must draw each of the digits of their phone number onto a 28x28 board and get the model to predict them all right to be able to enter their phone number.

## Installation
1. Clone the repo:
```bash
git clone https://github.com/LucasHJin/worst-ui.git
```
2. Install dependencies on the front and backend, respectively:
```bash
cd frontend
npm install
```
```bash
cd backend
pip install -r requirements.txt
```

## Usage
1. Navigate to the backend and start up the backend server.
```bash
cd backend
uvicorn main:app --reload
```
2. Navigate to the frontend to start up the frontend server.
```bash
cd frontend
npm run dev
```
3. Visit localhost:5800 in your browser and start entering your phone number following the instructions.

### Instructions
- **Hold down the mouse button** to draw on the grid
    - Note that going over a cell repeatedly darkens it and that the cell needs to be dark enough to be recognized by the model
- **Release the mouse button** to erase cells on the grid (colour them back to white)
- **Watch out** for the cells randomly darkening (this increases in speed as you fill out more of your phone number and can affect the model's prediction)
- **Be aware** that if you press restart, you give up on all the progress on your phone number as well

## Author
- Lucas Jin - [@lucashjin](https://github.com/LucasHJin)

## Credits
- https://huggingface.co/lizardwine/DigitClassifier
    - The model used to classify the drawn digits