package server

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/shaardie/listinator/database"
)

func (s server) entryList() echo.HandlerFunc {
	return func(c echo.Context) error {
		es := []database.Entry{}
		if err := s.db.Order("updated_at asc").Order("bought asc").Find(&es).Error; err != nil {
			return echo.ErrInternalServerError.SetInternal(fmt.Errorf("unable to get lists from database, %w", err))
		}
		return c.JSON(http.StatusOK, es)
	}
}

func (s server) entryCreate() echo.HandlerFunc {
	type input struct {
		Name   string `json:"Name"`
		Number string `json:"Number"`
	}
	return func(c echo.Context) error {
		var i input
		if err := c.Bind(&i); err != nil {
			return echo.ErrBadRequest.SetInternal(err)
		}

		e := database.Entry{
			Name:   i.Name,
			Number: i.Number,
		}
		if err := s.db.Create(&e).Error; err != nil {
			return echo.ErrInternalServerError.SetInternal(err)
		}

		return c.JSON(http.StatusCreated, e)
	}
}

func (s server) entryUpdate() echo.HandlerFunc {
	type input struct {
		ID     uuid.UUID `param:"ID"`
		Name   string    `json:"Name"`
		Number string    `json:"Number"`
		Bought bool      `json:"Bought"`
	}
	return func(c echo.Context) error {
		var i input
		if err := c.Bind(&i); err != nil {
			return echo.ErrBadRequest.SetInternal(err)
		}

		e := database.Entry{
			Model: database.Model{
				ID: i.ID,
			},
		}
		if err := s.db.First(&e).Error; err != nil {
			// TODO: handle different errors
			return echo.NotFoundHandler(c)
		}
		e.Name = i.Name
		e.Number = i.Number
		e.Bought = i.Bought

		if err := s.db.Save(&e).Error; err != nil {
			return echo.ErrInternalServerError.SetInternal(err)
		}

		return c.JSON(http.StatusOK, e)
	}
}

func (s server) entryDelete() echo.HandlerFunc {
	type input struct {
		ID uuid.UUID `param:"ID"`
	}
	return func(c echo.Context) error {
		var i input
		if err := c.Bind(&i); err != nil {
			return echo.ErrBadRequest.SetInternal(err)
		}

		e := database.Entry{
			Model: database.Model{
				ID: i.ID,
			},
		}
		if err := s.db.Delete(&e).Error; err != nil {
			// TODO: handle different errors
			return echo.NotFoundHandler(c)
		}
		return c.JSON(http.StatusOK, e)
	}
}
