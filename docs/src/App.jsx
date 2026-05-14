//Import everying (EVERYTHING)
import { useState, useEffect, useRef} from 'react';
import './App.css'
import logo from "./assets/logo.png"
import nutrImg from './assets/nutrition.jpg'
import exerImg from './assets/exercise.jpg'
import slepImg from './assets/sleep.png'
import plankImg from './assets/plank.jpg'
import pushupImg from './assets/pushup.jpg'
import situpImg from './assets/situp.jpg'
import clockImg from './assets/clock.png'
import nobgLogoImg from "./assets/nobglogo.png"
import pushupVideo from './assets/pushup.mp4'
import plankVideo from './assets/plank.mp4'
import situpVideo from './assets/situp.mp4'
import { use } from 'react';

//Landing page setup
function LandingPage({ setActivePage, setUserInfo }) {
  const [step, setStep] = useState(-1);
  const [info, setInfo] = useState({ name: "", weight: "", height: "", age: "", sex: "" });

  //User biometric scan check
const steps = [
  { key: "name", label: "NAME", placeholder: "e.g. Alex", unit: null },
  { key: "weight", label: "WEIGHT", placeholder: "e.g. 70", unit: "kg" },
  { key: "height", label: "HEIGHT", placeholder: "e.g. 175", unit: "cm" },
  { key: "age",    label: "AGE",    placeholder: "e.g. 28",  unit: "yrs" },
  { key: "sex",    label: "SEX",    placeholder: null, unit: null, options: ["Male", "Female", "Other"] },
];

  const current = steps[step] ?? {};
  const isLast  = step === steps.length - 1;
  const value   = info[current.key] ?? "";

  //Setup to go from launch to dashborad
  function handleNext() {
    if (!value) return;
    if (isLast) { setUserInfo(info); setActivePage("dashboard"); return; }
    setStep(s => s + 1);
  }

  if (step === -1) {
    return (
      <div className="landing-container">
        <div className="landing-card">
          <img className="logo" src={logo} alt="EVE" />
          <h1 className="landing-title">EVE</h1>
          <p className="landing-subtitle">EXTRATERRESTRIAL VITALITY ENGINE</p>
          <p className="landing-desc">Your personal wellness system for long-haul space travel. Nutrition, exercise, and sleep, optimised for life beyond Earth.</p>
          <button className="signupBtn" onClick={() => setStep(0)}>Initialize Mission</button>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-container">
      <div className="landing-card">
        <img className="logo" src={logo} alt="EVE" />
        <h1 className="landing-title">EVE</h1>
        <div className="progress-row">
          {steps.map((_, i) => (
            <div key={i} className={`progress-dot ${i <= step ? "progress-dot--active" : ""}`} />
          ))}
        </div>
        <p className="step-label">{current.label}</p>
        {current.options ? (
          <div className="option-row">
            {current.options.map(opt => (
              <button key={opt} className={`option-btn ${value === opt ? "option-btn--active" : ""}`} onClick={() => setInfo(p => ({ ...p, [current.key]: opt }))}>
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="input-row">
  <input
    className="eve-input"
    type={current.key === "name" ? "text" : "number"}
    placeholder={current.placeholder}
    value={value}
    onChange={e =>
      setInfo(p => ({ ...p, [current.key]: e.target.value }))
    }
  />
  <span className="input-unit">{current.unit}</span>
</div>
        )}
        <button className="signupBtn" disabled={!value} onClick={handleNext}>
          {isLast ? "Initialize Mission" : "Next →"}
        </button>
        {step > 0 && <button className="backBtn" onClick={() => setStep(s => s - 1)}>← Back</button>}
      </div>
    </div>
  );
}

//Dashboard function
function Dashboard({ userInfo }) {
  const [activeTab, setActiveTab] = useState("n");
  const calRef = useRef(0);
  const calRef2 = useRef(2000);
  const ssRef = useRef(0);
  const exminsRef = useRef(0);
  const exminsRef2 = useRef(0);

  let Tab = Nutrition;
  if (activeTab === "n") Tab = Nutrition;
  if (activeTab === "s") Tab = Sleep;
  if (activeTab === "e") Tab = Exercise;

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  const date = new Date(3067, 4, 9).toLocaleDateString();

//Function to change tabs via section headers
function handleTabChange(tab) {
  setActiveTab(tab);

  window.scrollTo({
    top: 500,
    behavior: "smooth"
  });
}



//Send data to watch
  const [sendDataText, setSendDataText] = useState("📂")
  return (
    <>
      <div className="dash__header">
        <div style={{ textAlign: "left" }}>
          <img src={nobgLogoImg} className='logo' />
        </div>
        <div style={{width: "250%"}}>
          <h1 className='dash-title'>
            Hello {userInfo.name || "User"}
          </h1>
        </div>
        <div className='senddata__container'>
          <button 
            className="senddata__btn" 
            onMouseLeave={() => {setSendDataText("📂")}}
            onClick={() => {
          const time = new Date().toLocaleTimeString();

          const watchDisplay = {
            cals: `${calRef.current}/${calRef2.current}`,
            ss: `${ssRef.current}%`,
            exmins: `${exminsRef.current}/${exminsRef2.current}min`,
            time: new Date().toLocaleTimeString(),
            dayssince: "379966"
          }

          fetch('http://localhost:3000/api/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(watchDisplay), // Convert JS object to JSON string
          })
      
          .catch((error) => {
            console.error('Error:', error);
          });
          setSendDataText("✓")
        }}>{sendDataText}</button>
          <p className="senddata__p">EVEWatch</p>
        </div>
        <div style={{ textAlign: "right", width: "100%" }} className="datetime">
          <h1>{date}</h1>
          <h1>{time}</h1>
        </div>
      </div>
      <div className="dash__btns">
        <div
          //Nutrition button
          onClick={() => setActiveTab("n")}
          className={`dash-card ${activeTab === "n" ? "dash-card-active" : ""}`}
          style={{ backgroundImage: `url(${nutrImg})` }}
        >
          Nutrition
        </div>
        <div
          // Exercise button
          onClick={() => setActiveTab("e")}
          className={`dash-card ${activeTab === "e" ? "dash-card-active" : ""}`}
          style={{ backgroundImage: `url(${exerImg})` }}
        >
          Exercise
        </div>
        <div
          //Sleeping button
          onClick={() => setActiveTab("s")}
          className={`dash-card ${activeTab === "s" ? "dash-card-active" : ""}`}
          style={{ backgroundImage: `url(${slepImg})` }}
        >
          Sleep
        </div>
      </div>
      <Tab userInfo={userInfo} calRef={calRef} calRef2={calRef2} ssRef={ssRef} exminsRef={exminsRef} exminsRef2={exminsRef2} />
    </>
  );
}

function Nutrition({ userInfo, calRef, calRef2 }) {
  const weight = userInfo.weight || 75;
  const height = userInfo.height || 160;
  const age = userInfo.age || 28;
  const sex = userInfo.sex || "Male";

  let CALORIE_GOAL = sex === "Male"
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : sex === "Female"
    ? (10 * weight) + (6.25 * height) - (5 * age) - 161
    : (10 * weight) + (6.25 * height) - (5 * age) - 130;
  CALORIE_GOAL = Math.round(CALORIE_GOAL * 1.7);
  calRef2.current = CALORIE_GOAL;

  const [cals, setCals] = useState(0);

  //macros
  const [p, setP] = useState(0);
  const [c, setC] = useState(0);
  const [f, setF] = useState(0);
  const [fb, setFb] = useState(0);

  const [mealPlan, setMealPlan] = useState({});
  
  const [expandedRecipe, setExpandedRecipe] = useState("");
  const [checkedRecipes, setCheckedRecipes] = useState([]); 
  
  const [foodName, setFoodName] = useState("");
  const [amount, setAmount] = useState("");
  const [calculateText, setCalculateText] = useState("Calculate Nutrition!")

  useEffect(() => {
    setCalculateText("Calculate Nutrition!")
    calRef.current = cals;
  }, [cals])

  useEffect(() => {
    setP(0);
    setC(0);
    setF(0);
    setFb(0);
    setCals(0);
    
    checkedRecipes.forEach((r) => {
      const recipe = mealPlan[r];
      setP(p + recipe.Protein);
      setC(c + recipe.Carbs);
      setF(f + recipe.Fat);
      setFb(fb + recipe.Fibre);
      setCals(cals + recipe.Calories);
    })
  }, [checkedRecipes])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (Object.keys(mealPlan).length === 0) {
          const response = await fetch(`https://eveos2.pythonanywhere.com/getmealplan?calories=${CALORIE_GOAL}`);
          const jsonData = await response.json();
          console.log(jsonData); // logs the data to the console
          setMealPlan(jsonData);
        }
      } catch (error) {
        console.log(error, "error"); // logs the error message to the console
      }
    };
    fetchData();
  }, []);

  function getNutritionData() {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://eveos2.pythonanywhere.com/getcalories?food=${foodName}&amount=${amount}`);
        const jsonData = await response.json();
        console.log(jsonData); // logs the data to the console
        setCals(jsonData.calories + cals);
        setP(jsonData.protein + p);
        setC(jsonData.carbs + c);
      } catch (error) {
        console.log(error, "error"); // logs the error message to the console
      }
    };

    fetchData()
  }
  
  if(Object.keys(mealPlan).length === 0) {
    return <div style={{textAlign: "center"}}><h1>Generating Meal Plan for Today...</h1></div>
  }

  const mealOrder = ['Breakfast', 'Lunch', 'Dinner'];
  
  const totalMacros = Object.values(mealPlan).reduce((acc, meal) => {
    acc.Carbs += meal.Carbs || 0;
    acc.Fat += meal.Fat || 0;
    acc.Fibre += meal.Fibre || 0;
    acc.Protein += meal.Protein || 0;
    return acc;
  }, { Carbs: 0, Fat: 0, Fibre: 0, Protein: 0 });
  
  const progress = Math.min(cals / CALORIE_GOAL, 1);
  const r = 60;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - progress);

  //Display the guage onto the form for nutrition
  return (
    <div className="splitcontainer">
      <div className="left">
        <h1>Goals</h1>
        <div className="gauge-wrap">
          <svg width="220" height="220" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={r} fill="none" stroke="#1C2F45" strokeWidth="14" />
            <circle cx="80" cy="80" r={r} fill="none" stroke="#63B3ED" strokeWidth="14"
              strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
              transform="rotate(-90 80 80)" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
          </svg>
          <div className="gauge-text">
            <span className="gauge-current">{cals}</span>
            <span className="gauge-goal">/ {CALORIE_GOAL} cal</span>
          </div>
        </div>

        <div className='macros'>
          <div className='macro'>
            <p className="m__name">Protein</p>
            <p>{p}/{totalMacros.Protein}g</p>
          </div>
          <div className='macro'>
            <p className="m__name">Carbs</p>
            <p>{c}/{totalMacros.Carbs}g</p>
          </div>
          <div className='macro'>
            <p className="m__name">Fat</p>
            <p>{f}/{totalMacros.Fat}g</p>
          </div>
          <div className='macro'>
            <p className="m__name">Fibre</p>
            <p>{fb}/{totalMacros.Fibre}g</p>
          </div>
        </div>

        <div style={{width: "90%", height: "1px", backgroundColor: "rgba(255,255,255,0.5)"}}></div>
  
        <div className='snack'>
          <h1>Add Snack</h1>
          <input placeholder='Food Name' value={foodName} onChange={(e) => {setFoodName(e.target.value)}}></input><br />
          <input placeholder='Amount' value={amount} onChange={(e) => {setAmount(e.target.value)}}></input><br />
          <button onClick={() => {
            getNutritionData();
            setCalculateText("Calculating...");
          }}>{calculateText}</button>
        </div>
        
      </div>



      <div className="right">
        <h1>Meal Plan</h1>
        {Object.keys(mealPlan).sort((a, b) => {return mealOrder.indexOf(a) - mealOrder.indexOf(b);}).map((m, i) => {
          return <div key={i}>
            <div className='meal__header'>
              <input type="checkbox" onChange={() => {
                if(checkedRecipes.includes(m)) {
                  setCheckedRecipes(checkedRecipes.filter(c => c !== m))
                }else{
                  setCheckedRecipes([...checkedRecipes, m])
                }
                }}></input><h4>{m}</h4>
            </div>
            <div className="meal__div">
              <div style={{width: '100%'}}>
                <p className='meal__name' style={{color: checkedRecipes.includes(m) ? "gray" : undefined}}>
                  {mealPlan[m].Name}
                </p>
                <div className='meal__cals'>
                  <p style={{color: checkedRecipes.includes(m) ? "gray" : undefined}}>{mealPlan[m].Calories}cal</p>
                  <p style={{color: checkedRecipes.includes(m) ? "gray" : undefined}}>{mealPlan[m].Protein}g protein</p>
                  <p style={{color: checkedRecipes.includes(m) ? "gray" : undefined}}>{mealPlan[m].Fat}g fat</p>
                  <p style={{color: checkedRecipes.includes(m) ? "gray" : undefined}}>{mealPlan[m].Fibre}g fibre</p>
                </div>
              </div>
              <div className='meal__expand'>
                {expandedRecipe === m ? <p onClick={() => {setExpandedRecipe("")}}>▲</p> : <p onClick={() => {setExpandedRecipe(m)}}>▼</p>}
              </div>
            </div>
            {expandedRecipe === m && 
            <div className='meal__recipe'>
              <p>{mealPlan[m].Recipe}</p>
            </div>}
          </div>
        })}
      </div>
    </div>
  )
}

//Everything in the sleep section
function Sleep({ userInfo, ssRef }) {
  const [wakeHour, setWakeHour] = useState(new Date().getHours());
  const [hoursSlept, setHoursSlept] = useState(7);

  //Calculate sleep quality based on sleep goal
  const SLEEP_GOAL = 8.5;
  const sleepScore = Math.round(Math.min(hoursSlept / SLEEP_GOAL, 1) * 100);
  const scoreColor = sleepScore >= 80 ? "#68D391" : sleepScore >= 50 ? "#F6AD55" : "#FC8181";
  ssRef.current = sleepScore;

  const r    = 60;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - sleepScore / 100);

  //Uses wake hours to find when the wake hour should be put to the form
  const hours = [];
  for (let i = wakeHour + 1; i < 23; i++) hours.push(i);

  return (
    <div className="splitcontainer">
      <div className="left">
        <div className="gauge-wrap">
          <svg width="220" height="220" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={r} fill="none" stroke="#1C2F45" strokeWidth="14" />
            <circle cx="80" cy="80" r={r} fill="none" stroke={scoreColor} strokeWidth="14"
              strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
              transform="rotate(-90 80 80)" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
          </svg>
          <div className="gauge-text">
            <span className="gauge-current" style={{ color: scoreColor }}>{sleepScore}</span>
            <span className="gauge-goal">sleep score</span>
          </div>
        </div>

        <div className="macro-targets">
          <div className="macro-target-row"><span style={{ color: "#63B3ED" }}>⊙ Hours slept</span><span>{hoursSlept}h / {SLEEP_GOAL}h</span></div>
          <div className="macro-target-row"><span style={{ color: scoreColor }}>⊙ Score</span><span>{sleepScore} / 100</span></div>
          <div className="macro-target-row"><span style={{ color: "#9F7AEA" }}>⊙ Recommended</span><span>8.5 hrs</span></div>
        </div>

        <div className="macro-bar-row">
          <div className="macro-bar" style={{ background: scoreColor, width: `${sleepScore}%` }} />
        </div>

        <div style={{border: "1px solid white", width: "70%", padding: "20px 50px", borderRadius: "25px", backgroundColor: "rgba(255, 255,255, 0.05)"}}>
        <p className="split-section-label">LOG LAST NIGHT</p>
        <div className="input-row">
          <input className="eve-input" type="number" min="0" max="12" placeholder="Hours slept" value={hoursSlept} onChange={e => setHoursSlept(Number(e.target.value))} />
          <span className="input-unit">hrs</span>
        </div>

        <p className="split-section-label">WAKE TIME</p>
        <div className="input-row">
          <input className="eve-input" type="number" min="0" max="23" value={wakeHour} onChange={e => setWakeHour(Number(e.target.value))} />
          <span className="input-unit">hr</span>
        </div>
        </div>

        <div className="sleep-tip">
          {sleepScore >= 80 && <p style={{ color: "#68D391" }}>✓ Optimal recovery achieved</p>}
          {sleepScore >= 50 && sleepScore < 80 && <p style={{ color: "#F6AD55" }}>⚠ Aim for 30 more minutes tonight</p>}
          {sleepScore < 50 && <p style={{ color: "#FC8181" }}>✗ Critical — sleep deprivation affects mission performance</p>}
        </div>
      </div>

      <div className="right">
        <h1>Good morning, {userInfo.name}</h1>
        <div className="slp__schedule">
          <div className="slp__section">
            <p>Woke up</p>
            <p>{wakeHour}:00</p>
          </div>
          {hours.map((h) => (
            <div key={h} className={`slp__section ${[12, 18, 21, 22].includes(h) ? "slp__special" : ""}`}>
              {h === 12 && <p>Lunch</p>}
              {h === 18 && <p>Dinner</p>}
              {h === 21 && <p>No more screens</p>}
              {h === 22 && <p>Bedtime</p>}
              <p className="slp__time">{h}:00</p>
            </div>
          ))}
          <div className="slp__section slp__special">
            <p>Somnologists recommend 9+ hours of sleep daily to preserve long-term and generational memories</p>
          </div>
        </div>
      </div>
    </div>
  );
}

//Everything to do with the exercise section
function Exercise({ userInfo, exminsRef, exminsRef2 }) {
  const weight = Number(userInfo.weight) || 70;
  const height = Number(userInfo.height) || 175;
  const age    = Number(userInfo.age) || 25;

  // space fitness recommendation
  // astronauts need more exercise to fight muscle/bone loss

  let EXERCISE_GOAL = 120; // base recommendation
  exminsRef2.current = EXERCISE_GOAL;

  EXERCISE_GOAL = Math.round(EXERCISE_GOAL);

  const [exercises, setExercises] = useState([
    {
      name: "Pushups",
      muscles: ["Chest", "Triceps"],
      time: 40,
      img: pushupImg,
      vid: pushupVideo,
      completed: false
    },
    {
      name: "Plank",
      muscles: ["Core", "Back"],
      time: 40,
      img: plankImg,
      vid: plankVideo,
      completed: false
    },
    {
      name: "Sit-ups",
      muscles: ["Core", "Hips"],
      time: 40,
      img: situpImg,
      vid: situpVideo,
      completed: false
    },
  ]);

  const [selectedVideo, setSelectedVideo] = useState(null);

  function toggleExercise(index) {
    setExercises(prev =>
      prev.map((ex, i) =>
        i === index
          ? { ...ex, completed: !ex.completed }
          : ex
      )
    );
  }

  const minutesWorked = exercises.reduce(
    (sum, ex) => ex.completed ? sum + ex.time : sum,
    0
  );
  exminsRef.current = minutesWorked;

  const progress = Math.min(minutesWorked / EXERCISE_GOAL, 1);

  const r = 60;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - progress);


  //Split the three categories into halves for easier management
  return (
    <>
      <div className="splitcontainer">

        {/* LEFT SIDE */}

        <div className="left">

          <div className="gauge-wrap">
            <svg width="220" height="220" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke="#1C2F45"
                strokeWidth="14"
              />

              <circle
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke="#63B3ED"
                strokeWidth="14"
                strokeDasharray={circ}
                strokeDashoffset={dash}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{
                  transition: "stroke-dashoffset 0.5s ease"
                }}
              />
            </svg>

            <div className="gauge-text">
              <span className="gauge-current">
                {minutesWorked}
              </span>

              <span className="gauge-goal">
                / {EXERCISE_GOAL} min
              </span>
            </div>
          </div>

          <div className="macro-targets">

            <div className="macro-target-row">
              <span style={{ color: "#63B3ED" }}>
                ⊙ Exercise
              </span>

              <span>
                {minutesWorked} / {EXERCISE_GOAL} min
              </span>
            </div>

            <div className="macro-target-row">
              <span style={{ color: "#68D391" }}>
                ⊙ Completed
              </span>

              <span>
                {
                  exercises.filter(ex => ex.completed).length
                } exercises
              </span>
            </div>

            <div className="macro-target-row">
              <span style={{ color: "#F6AD55" }}>
                ⊙ Calories Burn
              </span>

              <span>
                {Math.round(minutesWorked * 8)} kcal
              </span>
            </div>

          </div>

          <div className="macro-bar-row">
            <div
              className="macro-bar"
              style={{
                background: "#63B3ED",
                width: `${progress * 100}%`
              }}
            />
          </div>

          <div className="sleep-tip">
            {progress >= 1 && (
              <p style={{ color: "#68D391" }}>
                ✓ Muscular degradation prevented
              </p>
            )}

            {progress >= 0.5 && progress < 1 && (
              <p style={{ color: "#F6AD55" }}>
                ⚠ Continue resistance training
              </p>
            )}

            {progress < 0.5 && (
              <p style={{ color: "#FC8181" }}>
                ✗ Bone density loss risk increasing
              </p>
            )}
          </div>

        </div>

        {/* RIGHT SIDE */}

        <div>
          <h1>Exercise Plan</h1>
          <h1>Bodyweight Fitness</h1>

          {exercises.map((ex, i) => (
            <div
              key={i}
              className="ex__section"
              style={{
                backgroundImage: `url(${ex.img})`
              }}
              onClick={() => setSelectedVideo(ex.vid)}
            >
              <div className="ex__header">
                <div className="ex__num">
                  {i + 1}
                </div>
                <p>{ex.name}</p>
                <input
                  type="checkbox"
                  checked={ex.completed}
                  onChange={() => toggleExercise(i)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
              <div className="ex__details">
                <p>{ex.time}min</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <div className="videooverlay">

          <video width="750" height="500" controls>
            <source
              src={selectedVideo}
              type="video/mp4"
            />
          </video>

          <button onClick={() => setSelectedVideo(null)}>
            Close
          </button>

        </div>
      )}
    </>
  );
}

//Gather information about the user into a variable packet to be sent to the arduino. Info obtained from button dashboard
export default function App() {
  const [activePage, setActivePage] = useState("landing");
  const [userInfo, setUserInfo] = useState({ weight: "", height: "", age: "", sex: "" });
  if (activePage === "landing")   return <LandingPage setActivePage={setActivePage} setUserInfo={setUserInfo} />;
  if (activePage === "dashboard") return <Dashboard userInfo={userInfo} />;
}