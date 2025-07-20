package main

import (
	"embed"
	"os"
	"path"

	"github.com/shaardie/listinator/database"
	"github.com/shaardie/listinator/server"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

//go:embed frontend/*
var frontendFS embed.FS

func main() {
	p := os.Getenv("LISTINATOR_DATABASE_DIR")
	dbPath := path.Join(p, "listinator.db")

	// init database
	db, err := database.Init(dbPath)
	if err != nil {
		panic(err)
	}

	e := echo.New()
	e.Use(middleware.Logger())

	// serve frontend directory, if it exists and otherwise servce the files
	// embeded in the binary. This makes development easier
	if _, err := os.Stat("frontend"); os.IsNotExist(err) {
		e.StaticFS("/", echo.MustSubFS(frontendFS, "frontend"))
	} else {
		e.Static("/", "frontend")
	}

	s := server.New(db)
	s.SetupRoutes(e)

	e.Logger.Fatal(e.Start("0.0.0.0:8080"))
}
