const express = require("express");
const mongodb = require("mongodb");

const app = express();
const port = 3000;

// const connectionString = "mongodb://localhost:27017/surveyDB";

// Connect to MongoDB

mongodb.MongoClient.connect("mongodb://localhost:27017/surveyDB", {
  useUnifiedTopology: true,
})
  .then((client) => {
    const db = client.db("surveyapp");
    const surveysCollection = db.collection("surveys");

    // Set up middleware to parse JSON data
    app.use(express.json());

    // Serve static files
    app.use(express.static("public"));

    // Endpoint to handle survey submissions
    app.post("/survey", (req, res) => {
      const surveyData = req.body;

      surveysCollection
        .insertOne(surveyData)
        .then(() => {
          res.sendStatus(200);
        })
        .catch((error) => {
          console.error(error);
          res.sendStatus(500);
        });
    });

    // Endpoint to retrieve survey results
    app.get("/survey", (req, res) => {
      surveysCollection
        .countDocuments()
        .then((totalSurveys) => {
          surveysCollection
            .find()
            .toArray()
            .then((surveys) => {
              const ages = surveys.map((survey) => parseInt(survey.age));
              const averageAge = ages.reduce((a, b) => a + b, 0) / ages.length;
              const oldestPerson = Math.max(...ages);
              const youngestPerson = Math.min(...ages);

              const pizzaPercentage = calculateFoodPercentage(surveys, "Pizza");
              const pastaPercentage = calculateFoodPercentage(surveys, "Pasta");
              const papWorsPercentage = calculateFoodPercentage(
                surveys,
                "Pap and Wors"
              );

              const eatOutRating = calculateRating(surveys, "eatOut");
              const watchMoviesRating = calculateRating(surveys, "watchMovies");
              const watchTVRating = calculateRating(surveys, "watchTV");
              const listenRadioRating = calculateRating(surveys, "listenRadio");

              const surveyResults = {
                totalSurveys,
                averageAge,
                oldestPerson,
                youngestPerson,
                pizzaPercentage,
                pastaPercentage,
                papWorsPercentage,
                eatOutRating,
                watchMoviesRating,
                watchTVRating,
                listenRadioRating,
              };

              res.json(surveyResults);
            })
            .catch((error) => {
              console.error(error);
              res.sendStatus(500);
            });
        })
        .catch((error) => {
          console.error(error);
          res.sendStatus(500);
        });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });

function calculateFoodPercentage(surveys, food) {
  const totalSurveys = surveys.length;
  const surveysWithFood = surveys.filter((survey) =>
    survey.favoriteFood.includes(food)
  );
  const surveysWithFoodCount = surveysWithFood.length;
  return (surveysWithFoodCount / totalSurveys) * 100;
}

function calculateRating(surveys, field) {
  const totalSurveys = surveys.length;
  const ratings = surveys.map((survey) => parseInt(survey[field]));
  const totalRating = ratings.reduce((a, b) => a + b, 0);
  const averageRating = totalRating / totalSurveys;
  return averageRating.toFixed(1);
}
