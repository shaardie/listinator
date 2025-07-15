package main

import (
	"github.com/shaardie/listinator/database"
	"github.com/shaardie/listinator/server"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// init database
	db, err := database.Init("./listinator.db")
	if err != nil {
		panic(err)
	}

	e := echo.New()
	e.Use(middleware.Logger())

	e.Static("/", "frontend")

	s := server.New(db)
	s.SetupRoutes(e)

	e.Logger.Fatal(e.Start("0.0.0.0:8080"))
}
