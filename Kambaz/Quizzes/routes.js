// Kambaz/Quizzes/routes.js
import * as quizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
  // Helper: only non-students can modify quizzes
  const requireNonStudent = (req, res) => {
    const currentUser = req.session?.["currentUser"];
    if (!currentUser) {
      res.status(401).send("Not logged in");
      return null;
    }
    // In Kanbas, roles are usually "STUDENT", "FACULTY", "ADMIN"
    if (currentUser.role === "STUDENT") {
      res.status(403).send("Only faculty can modify quizzes");
      return null;
    }
    return currentUser;
  };

  // ===== QUIZZES CRUD =====

  const findQuizzesForCourse = async (req, res) => {
    const { cid } = req.params;
    const quizzes = await quizzesDao.findQuizzesForCourse(cid);
    res.json(quizzes);
  };

  const createQuizForCourse = async (req, res) => {
    if (!requireNonStudent(req, res)) return;
    const { cid } = req.params;
    const quiz = req.body;
    const newQuiz = await quizzesDao.createQuizForCourse(cid, quiz);
    res.json(newQuiz);
  };

  const findQuizById = async (req, res) => {
    const { qid } = req.params;
    const quiz = await quizzesDao.findQuizById(qid);
    if (!quiz) {
      return res.status(404).send("Quiz not found");
    }
    res.json(quiz);
  };

  const updateQuiz = async (req, res) => {
    if (!requireNonStudent(req, res)) return;
    const { qid } = req.params;
    const quiz = req.body;
    const status = await quizzesDao.updateQuiz(qid, quiz);
    res.json(status);
  };

  const deleteQuiz = async (req, res) => {
    if (!requireNonStudent(req, res)) return;
    const { qid } = req.params;
    const status = await quizzesDao.deleteQuiz(qid);
    res.json(status);
  };

  // ===== ATTEMPTS =====

  const gradeAttempt = (quiz, rawAnswersArray) => {
    const questions = quiz.questions || [];
    let score = 0;
    const possibleScore = questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0
    );

    const gradedAnswers = questions.map((q, index) => {
      const raw = rawAnswersArray?.[index];
      let isCorrect = false;

      if (!q || raw === undefined || raw === null) {
        return { questionIndex: index, value: raw ?? null, isCorrect: false };
      }

      const type = q.type || "MULTIPLE_CHOICE";

      if (type === "MULTIPLE_CHOICE" || type === "TRUE_FALSE") {
        isCorrect = Number(raw) === Number(q.correctChoice ?? 0);
      } else if (type === "FILL_IN_BLANK") {
        const studentText = String(raw || "").trim().toLowerCase();
        const correctAnswers = (q.correctAnswers || []).map((a) =>
          String(a).trim().toLowerCase()
        );
        isCorrect = correctAnswers.includes(studentText);
      }

      if (isCorrect) {
        score += q.points || 0;
      }

      return { questionIndex: index, value: raw, isCorrect };
    });

    return { score, possibleScore, gradedAnswers };
  };

  // POST /api/quizzes/:qid/attempts
  const createAttempt = async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session?.["currentUser"];

    if (!currentUser?._id) {
      return res.status(401).send("Not logged in");
    }

    const quiz = await quizzesDao.findQuizById(qid);
    if (!quiz) {
      return res.status(404).send("Quiz not found");
    }

    const { answers } = req.body || {};
    const { score, possibleScore, gradedAnswers } = gradeAttempt(
      quiz,
      answers
    );

    const lastAttempt = await quizzesDao.findLastAttemptForQuizAndStudent(
      qid,
      currentUser._id
    );
    const previousAttemptNumber = lastAttempt?.attemptNumber || 0;

    const multipleAttempts = !!quiz.multipleAttempts;
    const maxAttempts = multipleAttempts ? quiz.maxAttempts || 1 : 1;
    const nextAttemptNumber = previousAttemptNumber + 1;

    if (nextAttemptNumber > maxAttempts) {
      return res.status(403).send("Maximum attempts reached");
    }

    const attemptDoc = {
      quiz: quiz._id,
      course: quiz.course,
      student: currentUser._id, // string like "567"
      attemptNumber: nextAttemptNumber,
      score,
      possibleScore,
      answers: gradedAnswers,
      submittedAt: new Date(),
    };

    const created = await quizzesDao.createAttempt(attemptDoc);
    res.json(created);
  };

  // GET /api/quizzes/:qid/attempts/me
  const findMyAttemptsForQuiz = async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session?.["currentUser"];

    if (!currentUser?._id) {
      return res.status(401).send("Not logged in");
    }

    const attempts = await quizzesDao.findAttemptsForQuizAndStudent(
      qid,
      currentUser._id
    );
    res.json(attempts);
  };

  // ===== ROUTE REGISTRATION =====

  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:cid/quizzes", createQuizForCourse);
  app.get("/api/quizzes/:qid", findQuizById);
  app.put("/api/quizzes/:qid", updateQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz);

  app.post("/api/quizzes/:qid/attempts", createAttempt);
  app.get("/api/quizzes/:qid/attempts/me", findMyAttemptsForQuiz);
}
