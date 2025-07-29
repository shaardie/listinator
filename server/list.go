package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/shaardie/listinator/database"
)

func (s server) listCreate() echo.HandlerFunc {
	return func(c echo.Context) error {
		l := database.List{}
		if err := s.db.Create(&l).Error; err != nil {
			return echo.ErrInternalServerError.SetInternal(err)
		}

		return c.JSON(http.StatusCreated, l)
	}
}
