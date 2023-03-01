const BaseController = require("./baseController");
const axios = require("axios");
const constant = require("../constant");
const getCurrentDate = require("../helpers/getCurrentDate");

class PortfoliosController extends BaseController {
  constructor(model) {
    super(model);
  }

  async getPortfolioGrowth(req, res) {
    const { user_id } = req.query;

    try {
      const data = await this.model.findAll({ where: { userId: user_id } });
      return res.send(data);
    } catch (err) {
      console.log("Error: ", err);
      return res.status(400).json({ success: false, message: "Error" });
    }
  }

  async updatePortfolio(req, res) {
    const { user_id } = req.body;
    const newDate = getCurrentDate();
    try {
      const response = await axios.get(constant.wallets.GET_ALL_HOLDINGS, {
        params: { user_id: user_id },
      });
      const holdings = response.data.data;
      let totalValue = 0;
      for (let i = 0; i < holdings.length; i++) {
        const value = parseFloat(holdings[i]["value"]).toFixed(2);
        totalValue += parseFloat(value);
      }

      const curr_data = await axios.get(
        constant.portfolio.GET_PORTFOLIO_GROWTH,
        {
          params: { user_id: user_id },
        }
      );
      const newDay = curr_data.data.length + 1;

      const payload = {
        userId: user_id,
        value: Math.floor(totalValue),
        dates: newDate,
        days: newDay,
      };

      const data = await this.model.create(payload);

      return res.status(200).send("Success");
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: "Error" });
    }
  }
}

module.exports = PortfoliosController;