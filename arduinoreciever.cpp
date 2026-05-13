#include <LiquidCrystal.h>
#include <Arduino.h>

//Declare the LCD Display
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

//Declare button pins
const int btnLeft = 8;
const int btnRight = 9;

//Declare constants
const int totalItems = 5; //Total items in array
int buttonCounter; //Amount of button presses
int currentIndex = 0; //Point of index of array position

//Declare string output array
String USERDATA[totalItems] = {"No Data","No Data","No Data","No Data","No Data"};

/*Read inputs
int calorieGoal;
int sleepGoal;
int exerciseGoal;
int time;
*/

//Headers by section
const char* headers[] = {"Calorie Progress:","Sleep Score:","Exercise Progress:","Time:","Days in Space:"};

//Function to display message on LCD
void displayMessage() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(headers[currentIndex]);
  lcd.setCursor(0, 1);
  lcd.print(USERDATA[currentIndex]);
  delay(100);
}

//Initialize
void setup() {
  Serial.begin(9600);
  pinMode(btnLeft, INPUT);
  pinMode(btnRight, INPUT);

  //16 wide two tall
  lcd.begin(16, 2);
  displayMessage();
}

void loop() {
  
  // Handle serial input
  if (Serial.available() > 0) {
    String rawData = Serial.readStringUntil('\n');

    //Find the break points in the serial's string
    int lastDelimiterIndex = 0;
    for (int i = 0; i < totalItems; i++) {
        int nextDelimiterIndex = rawData.indexOf('|', lastDelimiterIndex);
        if (nextDelimiterIndex == -1) { //If it doesn't find a point to break, take the last piece of data
          USERDATA[i] = rawData.substring(lastDelimiterIndex);
        } else { //If it doesn't not find a point to break
          USERDATA[i] = rawData.substring(lastDelimiterIndex, nextDelimiterIndex);
          lastDelimiterIndex = nextDelimiterIndex + 1;
        }
      }     
    }
    displayMessage();

  // Handle buttons
  if (digitalRead(btnLeft) == HIGH) {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    displayMessage();
    delay(300);
  }

  if (digitalRead(btnRight) == HIGH) {
    currentIndex = (currentIndex + 1) % totalItems;
    displayMessage();
    delay(300);
  }
}