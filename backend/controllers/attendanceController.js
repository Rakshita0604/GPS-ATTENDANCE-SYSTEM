import db from "../config/db.js";

// 📌 MARK ATTENDANCE (CHECK-IN / CHECK-OUT)
export const markAttendance = (req, res) => {
  const { user_id, latitude, longitude, type } = req.body;

  const image = req.file ? req.file.filename : null;

  // Decide status based on time (simple logic)
  const currentHour = new Date().getHours();
  let status = "present";

  if (currentHour > 10) {
    status = "late";
  }

  if (type === "check-out") {
    const updateQuery = `
      UPDATE attendance 
      SET check_out = CURTIME()
      WHERE user_id = ? AND date = CURDATE()
    `;

    db.query(updateQuery, [user_id], (err) => {
      if (err) return res.status(500).send(err);

      return res.send({ message: "Checked out successfully" });
    });

  } else {
    const insertQuery = `
      INSERT INTO attendance 
      (user_id, date, check_in, latitude, longitude, status, image)
      VALUES (?, CURDATE(), CURTIME(), ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [user_id, latitude, longitude, status, image],
      (err) => {
        if (err) return res.status(500).send(err);

        res.send({ message: "Checked in successfully" });
      }
    );
  }
};



// 📌 GET ALL ATTENDANCE (FOR HISTORY)
export const getAttendance = (req, res) => {
  const { user_id } = req.query;

  let query = `
    SELECT * FROM attendance
  `;

  if (user_id) {
    query += ` WHERE user_id = ${user_id}`;
  }

  query += ` ORDER BY date DESC`;

  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);

    res.send(result);
  });
};



// 📊 DASHBOARD DATA (IMPORTANT)
export const getDashboardData = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      COUNT(CASE WHEN status='present' THEN 1 END) AS present,
      COUNT(CASE WHEN status='late' THEN 1 END) AS late,
      COUNT(CASE WHEN status='absent' THEN 1 END) AS absent
    FROM attendance
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).send(err);

    res.send(result[0]);
  });
};