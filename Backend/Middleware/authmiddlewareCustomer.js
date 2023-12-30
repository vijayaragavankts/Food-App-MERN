const protectCustomer = async (req, res, next) => {
  const id = req.session.customer_id;
  if (id) {
    next();
  } else {
    res.redirect("/customer");
  }
};

module.exports = protectCustomer;
