package server

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/shaardie/listinator/database"
)

func (s server) typeList() echo.HandlerFunc {
	return func(c echo.Context) error {
		ts := []database.Type{}
		if err := s.db.Order("name").Find(&ts).Error; err != nil {
			return echo.ErrInternalServerError.SetInternal(fmt.Errorf("unable to get types from database, %w", err))
		}
		return c.JSON(http.StatusOK, ts)
	}
}
