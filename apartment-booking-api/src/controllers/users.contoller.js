import { UserService } from "../services/user.service.js";
export const register = async (req, res) => {
  const userService = new UserService();
    try {
      const response = await userService.createUser(req.body);
      res.status(response.status).json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

export const getUser = async (req, res) => {
  const userService = new UserService();
  try {
    const userId = Number(req.params.id);
    const response = await userService.getUserById(userId);
    res.status(response.status).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};