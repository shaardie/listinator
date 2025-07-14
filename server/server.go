package server

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type server struct {
	db *gorm.DB
}

func New(db *gorm.DB) server {
	return server{
		db: db,
	}
}

func (s server) SetupRoutes(e *echo.Echo) {
	e.GET("/api/v1/entries", s.entryList())
	e.POST("/api/v1/entries", s.entryCreate())
	e.PUT("/api/v1/entries/:id", s.entryUpdate())
}
