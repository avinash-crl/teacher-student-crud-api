const userService = require("../services/user.services");

class UserController {
  async signup(req, res) {
    try {
      const data = await userService.signup(req.body);
      return res.status(201).json({ message: "Signup successful", data });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const data = await userService.loginUser(req.body.email, req.body.password);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  async getAllStudents(req, res) {
    try {
      const data = await userService.getAllStudents();
      return res.status(200).json({ count: data.length, data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllFaculty(req, res) {
    try {
      const data = await userService.getAllFaculty();
      return res.status(200).json({ count: data.length, data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }  

  async getMe(req, res) {
    try {
      const data = await userService.getMyAccount(req.user.id);
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async updateMe(req, res) {
    try {
      const data = await userService.updateMyAccount(req.user.id, req.body);
      return res.status(200).json({ message: "Account updated successfully", data });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async addMyProfile(req, res) {
    try {
      const data = await userService.addMyProfile(req.user.id, req.body);
      return res.status(201).json({ message: "Profile created successfully", data });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateMyProfile(req, res) {
    try {
      const data = await userService.updateMyProfile(req.user.id, req.body);
      return res.status(200).json({ message: "Profile updated successfully", data });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateStudent(req, res) {
    try {
      const data = await userService.updateStudent(req.params.id, req.body);
      return res.status(200).json({ message: "Student updated successfully", data });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateStudentProfile(req, res) {
    try {
      const data = await userService.updateStudentProfile(req.params.id, req.body);
      return res.status(200).json({ message: "Student profile updated successfully", data });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async softDeleteStudent(req, res) {
    try {
      const data = await userService.softDeleteStudent(req.params.id);
      return res.status(200).json({ message: "Student soft-deleted successfully", data });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
