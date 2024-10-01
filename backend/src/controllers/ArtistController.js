class ArtistController {
  constructor(connection) {
    this.connection = connection;
  }

  addArtist = async (req, res) => {
    const {
      name,
      dob,
      gender,
      address,
      first_release_year,
      no_of_albums_released,
    } = req.body;

    try {
      const query = `INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released) VALUES("${name}", "${dob}", "${gender}", "${address}", "${parseInt(
        first_release_year
      )}", "${parseInt(no_of_albums_released)}")`;
      const [result] = await this.connection.query(query);
      res.send(result);
    } catch (err) {
      res.status(404).json({ success: false, message: err });
    }
  };

  updateArtist = async (req, res) => {
    const { id } = req.params;
    const {
      name,
      dob,
      gender,
      address,
      first_release_year,
      no_of_albums_released,
    } = req.body;
    if (!id) {
      return res.status(403).json({ success: false, message: "ID not found" });
    }

    const updateItemObject = {};
    if (name && name.trim() !== "") {
      updateItemObject.name = name;
    }
    if (dob && dob.trim() !== "") {
      updateItemObject.dob = dob;
    }
    if (gender && gender.trim() !== "") {
      updateItemObject.gender = gender;
    }
    if (address && address.trim() !== "") {
      updateItemObject.address = address;
    }
    if (first_release_year && first_release_year.trim() !== "") {
      updateItemObject.first_release_year = first_release_year;
    }
    if (no_of_albums_released && no_of_albums_released.trim() !== "") {
      updateItemObject.no_of_albums_released = no_of_albums_released;
    }

    if (Object.keys(updateItemObject).length === 0) {
      return res.status(400).json({ error: "No valid changes provided" });
    }

    try {
      const updateItemArray = Object.entries(updateItemObject).map(
        ([key, value]) => `${key}="${value}"`
      );
      const query = `UPDATE artist SET ${updateItemArray.join(
        ", "
      )} WHERE id=${id}`;
      const [result] = await this.connection.query(query);
      res.json({
        success: true,
        message: result,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Database error", error: err });
    }
  };

  deleteArtist = async (req, res) => {
    const { id } = req.params;
    try {
      const query = `DELETE FROM artist WHERE id=${id};`;
      const [result] = await this.connection.query(query);
      res.json({ success: true, message: result });
    } catch (err) {
      res.status(403).json({ success: false, message: err });
    }
  };

  searchArtist = async (req, res) => {
    const { searchQuery } = req.body;
    const whereClause = [];

    if (searchQuery && searchQuery.trim() !== "") {
      const formattedQuery = searchQuery.trim();
      const arrRep = formattedQuery.split(",");

      arrRep.forEach((elem) => {
        const splitElement = elem.split(":");
        if (splitElement.length === 2) {
          const key = splitElement[0].trim();
          const value = `%${splitElement[1].trim()}%`;
          whereClause.push(`${key} LIKE "${value}"`);
        }
      });

      if (whereClause.length > 0) {
        try {
          const query = `SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released
          FROM artist
          WHERE ${whereClause.join(" AND ")}`;

          const [result] = await this.connection.query(query);
          if (result.length > 0) {
            res.send(result);
          } else {
            res.json({ success: true, message: "No such user available" });
          }
        } catch (error) {
          console.error("Query error:", error);
          res.json({ success: false, message: "Couldn't get the result" });
        }
      } else {
        res.json({
          success: false,
          message: "No valid search parameters provided.",
        });
      }
    } else {
      res.json({ success: false, message: "Search query cannot be empty." });
    }
  };

  getAllArtist = async (req, res) => {
    try {
      const query = `SELECT * FROM artist`;
      const [result] = await this.connection.query(query);
      result.length > 0
        ? res.send(result)
        : res.json({ success: true, message: "Sorry! No entires found" });
      res.send(result);
    } catch (err) {
      res.status(403).json({ success: false, message: err });
    }
  };
}

export default ArtistController;
