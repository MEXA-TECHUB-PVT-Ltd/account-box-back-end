const balance_accountModel = require("../models/balance_accountModel");
const mongoose = require("mongoose");
const moment = require('moment');
const shopsModel = require("../models/shopsModel");
const daily_assigned_fund = require("../models/daily_assigned_fund");
const expensesModel = require("../models/expensesModel");

// Get All balance_account 
exports.getAllbalance_accounts = (req, res) => {
    balance_accountModel.find({}, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.send(result)
        }
    }).sort({ $natural: -1 })
}
// Get balance_account 
exports.getSpecificbalance_account = (req, res) => {
    const balance_accountId = req.params.balance_accountsId;
    balance_accountModel.find({ _id: balance_accountId }, function (err, foundResult) {
        try {
            res.json({ data: foundResult })
        } catch (err) {
            res.json(err)
        }
    })
}
// Get balance_account by shop Id
exports.getAllBalanceAccountByShopId = (req, res) => {
    const ShopId = req.params.shop_id;
    balance_accountModel.find({ shop_id: ShopId }, function (err, foundResult) {
        try {
            res.json({ data: foundResult, count: foundResult.length })
        } catch (err) {
            res.json(err)
        }
    }).sort({date: 'desc'})
}

// Delete 
exports.deletebalance_account = (req, res) => {
    const balance_accountId = req.params.balance_accountsId;
    balance_accountModel.findByIdAndDelete(balance_accountId, (error, result) => {
        if (error) {
            res.send({ message: error.message })
        } else {
            res.json({ message: "Deleted Successfully" })
        }
    })
}
// Create 
exports.createbalance_account = async (req, res) => {
    const Createddate = req.body.date;
    const ShopId = req.body.shop_id;
    balance_accountModel.find({ shop_id: ShopId, date: moment(Createddate).format("DD/MM/YYYY") }, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            // res.send(result)
            if (result === undefined || result.length == 0) {
                console.log("empty")
                daily_assigned_fund.find({ shop_id: ShopId, date: moment(Createddate).format("DD/MM/YYYY") }, (error, result) => {
                    if (error) {
                        res.send(error)
                    } else {
                        if (result === undefined || result.length == 0) {
                            res.json({ message: "No Daily Assigned Fund Found for this ShopId And Date" })
                        } else {
                            const DailyAssignedFundId = result[0]._id
                            const AmountDailyAssignedFund = result[0].amount

                            shopsModel.find({ _id: ShopId }, (error, result) => {
                                if (error) {
                                    res.send(error)
                                } else {
                                    if (result[0].manager_id === undefined || result[0].manager_id == '') {
                                        res.json({ message: "No Manger Assigned for this ShopId" })
                                    } else {
                                        // res.send(result)
                                        const ManagerId = result[0].manager_id
                                        expensesModel.find({ shop_id: ShopId, created_at: moment(Createddate).format("DD/MM/YYYY") }, (error, result) => {
                                            if (error) {
                                                res.send(error)
                                            } else {
                                                const ArrExpense = result
                                                // res.send(result)
                                                // Calculate Sum of all Expenses 
                                                var sum = 0;
                                                for (var i = 0; i < result.length; i++) {
                                                    sum += parseInt(result[i].amount)
                                                }
                                                // Calculate Sum of all Expenses  + Cash Balance  + Admin Balance
                                                const Total_amount_included = sum + parseInt(req.body.cash_balance) + parseInt(req.body.admin_balance)
                                                // Check Shortage 
                                                var shortage_status = false
                                                if (Total_amount_included == AmountDailyAssignedFund) {
                                                    shortage_status = false

                                                } else {
                                                    shortage_status = true
                                                }
                                                // Creating Balance Amount 

                                                const balance_account = new balance_accountModel({
                                                    _id: mongoose.Types.ObjectId(),
                                                    daily_assigned_fund_id: DailyAssignedFundId,
                                                    daily_assigned_fund: AmountDailyAssignedFund,
                                                    shop_id: req.body.shop_id,
                                                    manager_id: ManagerId,
                                                    cash_balance: req.body.cash_balance,
                                                    admin_balance: req.body.admin_balance,
                                                    expenses_amount: sum,
                                                    shortage_status: shortage_status,
                                                    amount: Total_amount_included,
                                                    date: moment(Createddate).format("DD/MM/YYYY")

                                                });
                                                balance_account.save((error, result) => {
                                                    if (error) {
                                                        res.send(error)
                                                    } else {
                                                        const updateData1 = {
                                                            $push: {
                                                                expenses_id: ArrExpense,
                                                            }
                                                        }
                                                        const options1 = {
                                                            new: true
                                                        }
                                                        balance_accountModel.findByIdAndUpdate(result._id, updateData1, options1, (error, result) => {
                                                            if (error) {
                                                                res.send(error)
                                                            } else {
                                                                res.json({ data: result, message: "Created Successfully" })
                                                            }
                                                        })
                                                    }
                                                })


                                            }
                                        })
                                    }


                                }
                            })
                        }


                    }
                })
            } else {
                res.json({ data: result, message: "Balance Account Already Exists for this date and Shop Id" })

            }
        }
    })



}
// Update 
exports.updatebalance_account = async (req, res) => {
    const updateData = {
        reason_of_amount: req.body.reason_of_amount,
        amount: req.body.amount,
    }
    const options = {
        new: true
    }
    balance_accountModel.findByIdAndUpdate(req.body._id, updateData, options, (error, result) => {
        if (error) {
            res.json(error.message)
        } else {
            res.send({ data: result, message: "Updated Successfully" })
        }
    })
}



