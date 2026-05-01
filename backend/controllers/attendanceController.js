// import db from "../config/db.js";

// export async function markAttendance(req, res, next) {
//   try {
//     const userId = req.user.id;
//     const type = req.body.type === "check-out" ? "check-out" : "check-in";
//     const lat = Number(req.body.lat ?? req.body.latitude);
//     const lng = Number(req.body.lng ?? req.body.longitude);
//     const image = req.file?.filename || null;

//     if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
//       return res.status(400).json({ message: "Valid latitude and longitude are required" });
//     }

//     if (type === "check-in" && !image) {
//       return res.status(400).json({ message: "Capture photo first" });
//     }

//     const [employeeRows] = await db.query("SELECT id FROM employees WHERE user_id = ?", [userId]);
//     const employeeId = employeeRows[0]?.id || null;

//     if (type === "check-out") {
//       const [result] = await db.query(
//         `UPDATE attendance
//          SET check_out = CURTIME(), lat = ?, lng = ?
//          WHERE user_id = ? AND attendance_date = CURDATE()`,
//         [lat, lng, userId]
//       );

//       if (result.affectedRows === 0) {
//         return res.status(400).json({ message: "Check in before checking out" });
//       }

//       return res.json({ message: "Checked out successfully" });
//     }

//     const currentHour = new Date().getHours();
//     const status = currentHour > 10 ? "late" : "present";

//     await db.query(
//       `INSERT INTO attendance
//        (user_id, employee_id, attendance_date, check_in, image, lat, lng, status)
//        VALUES (?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?)
//        ON DUPLICATE KEY UPDATE
//        check_in = CURTIME(),
//        image = VALUES(image),
//        lat = VALUES(lat),
//        lng = VALUES(lng),
//        status = VALUES(status)`,
//       [userId, employeeId, image, lat, lng, status]
//     );

//     res.json({
//       message: "Checked in successfully",
//       image: image ? `/uploads/${image}` : null,
//       lat,
//       lng,
//       status,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function getAttendance(req, res, next) {
//   try {
//     const params = [];
//     let where = "";

//     if (req.user.role !== "admin") {
//       where = "WHERE a.user_id = ?";
//       params.push(req.user.id);
//     } else if (req.query.user_id) {
//       where = "WHERE a.user_id = ?";
//       params.push(req.query.user_id);
//     }

//     const [rows] = await db.query(
//       `SELECT
//         a.id,
//         a.user_id,
//         a.attendance_date,
//         a.check_in,
//         a.check_out,
//         a.image,
//         a.lat,
//         a.lng,
//         a.status,
//         e.employee_code,
//         COALESCE(e.name, u.name) AS name,
//         u.email
//        FROM attendance a
//        JOIN users u ON u.id = a.user_id
//        LEFT JOIN employees e ON e.id = a.employee_id
//        ${where}
//        ORDER BY a.attendance_date DESC, a.id DESC`,
//       params
//     );

//     res.json(rows);
//   } catch (error) {
//     next(error);
//   }
// }

// export async function getDashboardData(req, res, next) {
//   try {
//     if (req.user.role === "admin") {
//       const [[employeeCount]] = await db.query("SELECT COUNT(*) AS totalEmployees FROM employees");
//       const [[todayStats]] = await db.query(`
//         SELECT
//           COUNT(*) AS presentToday,
//           SUM(status = 'late') AS lateToday
//         FROM attendance
//         WHERE attendance_date = CURDATE()
//       `);

//       return res.json({
//         totalEmployees: employeeCount.totalEmployees || 0,
//         presentToday: todayStats.presentToday || 0,
//         lateToday: todayStats.lateToday || 0,
//       });
//     }

//     const [[stats]] = await db.query(
//       `SELECT
//         COUNT(*) AS total,
//         SUM(status = 'present') AS present,
//         SUM(status = 'late') AS late
//        FROM attendance
//        WHERE user_id = ?`,
//       [req.user.id]
//     );

//     res.json({
//       total: stats.total || 0,
//       present: stats.present || 0,
//       late: stats.late || 0,
//       absent: 0,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function saveOfficeLocation(req, res, next) {
//   try {
//     const { lat, lng, radius } = req.body;

//     if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng)) || !Number.isFinite(Number(radius))) {
//       return res.status(400).json({ message: "Valid latitude, longitude, and radius are required" });
//     }

//     await db.query(
//       `REPLACE INTO app_settings (setting_key, setting_value)
//        VALUES ('office_location', ?)`,
//       [JSON.stringify({ lat: Number(lat), lng: Number(lng), radius: Number(radius) })]
//     );

//     res.json({ message: "Office location saved successfully" });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function getOfficeLocation(_req, res, next) {
//   try {
//     const [rows] = await db.query(
//       "SELECT setting_value FROM app_settings WHERE setting_key = 'office_location'"
//     );

//     if (rows.length === 0) {
//       return res.json({ lat: "", lng: "", radius: 150 });
//     }

//     res.json(JSON.parse(rows[0].setting_value));
//   } catch (error) {
//     next(error);
//   }
// }




import db from "../config/db.js";

export async function markAttendance(req, res, next) {
  try {
    const userId = req.user.id;
    const type = req.body.type === "check-out" ? "check-out" : "check-in";
    const lat = String(req.body.lat ?? req.body.latitude ?? "");
    const lng = String(req.body.lng ?? req.body.longitude ?? "");
    const image = req.file?.filename || null;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Valid latitude and longitude are required" });
    }

    if (type === "check-in" && !image) {
      return res.status(400).json({ message: "Capture photo first" });
    }

    const [employeeRows] = await db.query("SELECT id FROM employees WHERE user_id = ?", [userId]);
    const employeeId = employeeRows[0]?.id || null;

    if (type === "check-out") {
      const [result] = await db.query(
        `UPDATE attendance
         SET check_out = CURTIME(), latitude = ?, longitude = ?
         WHERE user_id = ? AND attendance_date = CURDATE()`,
        [lat, lng, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "Check in before checking out" });
      }

      return res.json({ message: "Checked out successfully" });
    }

    const currentHour = new Date().getHours();
    const status = currentHour > 10 ? "late" : "present";

    await db.query(
      `INSERT INTO attendance
       (user_id, employee_id, attendance_date, check_in, image, latitude, longitude, status)
       VALUES (?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       check_in = CURTIME(),
       image = VALUES(image),
       latitude = VALUES(latitude),
       longitude = VALUES(longitude),
       status = VALUES(status)`,
      [userId, employeeId, image, lat, lng, status]
    );

    res.json({
      message: "Checked in successfully",
      image: image ? `/uploads/${image}` : null,
      lat,
      lng,
      status,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAttendance(req, res, next) {
  try {
    const params = [];
    let where = "";

    if (req.user.role !== "admin") {
      where = "WHERE a.user_id = ?";
      params.push(req.user.id);
    } else if (req.query.user_id) {
      where = "WHERE a.user_id = ?";
      params.push(req.query.user_id);
    }

    const [rows] = await db.query(
      `SELECT
        a.id,
        a.user_id,
        a.attendance_date,
        a.check_in,
        a.check_out,
        a.image,
        a.latitude,
        a.longitude,
        a.status,
        e.employee_code,
        COALESCE(e.name, u.name) AS name,
        u.email
       FROM attendance a
       JOIN users u ON u.id = a.user_id
       LEFT JOIN employees e ON e.id = a.employee_id
       ${where}
       ORDER BY a.attendance_date DESC, a.id DESC`,
      params
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function getDashboardData(req, res, next) {
  try {
    if (req.user.role === "admin") {
      const [[employeeCount]] = await db.query("SELECT COUNT(*) AS totalEmployees FROM employees");
      const [[todayStats]] = await db.query(`
        SELECT
          COUNT(*) AS presentToday,
          SUM(status = 'late') AS lateToday
        FROM attendance
        WHERE attendance_date = CURDATE()
      `);

      return res.json({
        totalEmployees: employeeCount.totalEmployees || 0,
        presentToday: todayStats.presentToday || 0,
        lateToday: todayStats.lateToday || 0,
      });
    }

    const [[stats]] = await db.query(
      `SELECT
        COUNT(*) AS total,
        SUM(status = 'present') AS present,
        SUM(status = 'late') AS late
       FROM attendance
       WHERE user_id = ?`,
      [req.user.id]
    );

    res.json({
      total: stats.total || 0,
      present: stats.present || 0,
      late: stats.late || 0,
      absent: 0,
    });
  } catch (error) {
    next(error);
  }
}

export async function saveOfficeLocation(req, res, next) {
  try {
    const { lat, lng, radius } = req.body;

    await db.query(
      `INSERT INTO admin_config (id, office_latitude, office_longitude, allowed_radius)
       VALUES (1, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       office_latitude = VALUES(office_latitude),
       office_longitude = VALUES(office_longitude),
       allowed_radius = VALUES(allowed_radius)`,
      [lat, lng, radius]
    );

    res.json({ message: "Office location saved successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getOfficeLocation(_req, res, next) {
  try {
    const [rows] = await db.query("SELECT * FROM admin_config WHERE id = 1");

    if (rows.length === 0) {
      return res.json({ lat: "", lng: "", radius: 150 });
    }

    const { office_latitude: lat, office_longitude: lng, allowed_radius: radius } = rows[0];
    res.json({ lat, lng, radius });
  } catch (error) {
    next(error);
  }
}