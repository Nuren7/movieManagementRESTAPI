import { prisma } from "../config/db.js";

const addToWatchList = async (req, res) => {
  const { movieId, status, rating, notes, userId } = req.body;

  //Verify movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  //Check if already added
  const existingInWatchList = await prisma.watchListItem.findUnique({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId,
      },
    },
  });


  //See if movie exists 
  if (existingInWatchList) {
    return res.status(400).json({ error: "Movie already in the wathclist" });
  }

  const watchListItem = await prisma.watchListItem.create({
    data: {
      userId,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "Success",
    data: {
      watchListItem,
    },
  });
};

export { addToWatchList };
