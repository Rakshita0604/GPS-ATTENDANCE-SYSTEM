import db from "../config/db.js";

// GET ADMIN CONFIG
export const getAdminConfig = (req, res) => {
  const query = "SELECT * FROM admin_config WHERE id = 1";

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching config", error: err.message });

    if (result.length === 0) {
      return res.json({ message: "No config found" });
    }

    res.json(result[0]);
  });
};

// UPDATE ADMIN CONFIG
export const updateAdminConfig = (req, res) => {
  const { office_latitude, office_longitude, allowed_radius } = req.body;

  const query = `
    INSERT INTO admin_config (id, office_latitude, office_longitude, allowed_radius)
    VALUES (1, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    office_latitude = ?,
    office_longitude = ?,
    allowed_radius = ?
  `;

  db.query(
    query,
    [office_latitude, office_longitude, allowed_radius, office_latitude, office_longitude, allowed_radius],
    (err) => {
      if (err) return res.status(500).json({ message: "Error updating config", error: err.message });

      res.json({ message: "Config updated successfully" });
    }
  );
};

// GET ALL USERS (FOR ADMIN)
export const getAllUsers = (req, res) => {
  const query = "SELECT id, name, email, phone, role FROM users";

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching users", error: err.message });

    res.json(result);
  });
};

// GET ATTENDANCE REPORT
export const getAttendanceReport = (req, res) => {
  const query = `
    SELECT 
      u.id,
      u.name,
      u.email,
      COUNT(CASE WHEN a.status='present' THEN 1 END) AS present,
      COUNT(CASE WHEN a.status='late' THEN 1 END) AS late,
      COUNT(CASE WHEN a.status='absent' THEN 1 END) AS absent,
      COUNT(*) AS total
    FROM users u
    LEFT JOIN attendance a ON u.id = a.user_id
    WHERE u.role = 'employee'
    GROUP BY u.id, u.name, u.email
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching report", error: err.message });

    res.json(result);
  });
};
