from google import genai
import json
import os

from flask import Flask, request, jsonify

app = Flask(__name__)

api_key = os.getenv('AI_API_KEY')

@app.route('/getcalories')
def hello_world():
    food = str(request.args.get('food'))
    amount = str(request.args.get('amount'))

    query = "If I ate " + amount + " " + food + " return the amount of calories, grams of protein and grams of carbs in a python dictionary. Include only the dictionary, DO NOT add any extra text."

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=query  
    )

    response = jsonify(json.loads(response.text))
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/getmealplan')
def mealplan():
    cals = str(request.args.get('calories'))

    query = "My daily calorie goal is "+cals+" generate a meal plan of breakfast, lunch, and dinner that add up to about " +cals+" calories. Format it as a python dictionary with Breakfast, Lunch and Dinner as keys and the values should be 'Name', then the amount of calories, protein, carbs, fibre, and fat as an integer, and a one sentence recipe. Please return ONLY the dictionary."

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=query
    )

    response = jsonify(json.loads(response.text))
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response