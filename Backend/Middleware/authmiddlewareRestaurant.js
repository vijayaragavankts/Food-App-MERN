const protectRestaurant = async (req, res, next) => {
  const id = req.session.restaurant_id;
  if (id) {
    next();
  } else {
    res.redirect("/restaurant");
  }
};

module.exports = protectRestaurant;
