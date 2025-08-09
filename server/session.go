package server

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/shaardie/listinator/database"
	"golang.org/x/crypto/bcrypt"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
)

const (
	sessionKey = "listinator_session"
)

func (s server) sessionCreate() echo.HandlerFunc {
	type input struct {
		Name     string `json:"name"`
		Password string `json:"password"`
	}
	return func(c echo.Context) error {
		var i input
		if err := c.Bind(&i); err != nil {
			return echo.ErrBadRequest.SetInternal(err)
		}

		if i.Name == "" || i.Password == "" {
			return echo.ErrBadRequest
		}

		u := database.User{}
		if err := s.db.Find(&u, "name = ?", i.Name).Error; err != nil {
			return echo.ErrUnauthorized.SetInternal(fmt.Errorf("unable to get user %v from database, %w", i.Name, err))
		}

		if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(i.Password)); err != nil {
			return echo.ErrUnauthorized.SetInternal(fmt.Errorf("wrong password for user %v, %w", i.Name, err))
		}

		sess, err := session.Get(sessionKey, c)
		if err != nil {
			return echo.ErrInternalServerError.SetInternal(fmt.Errorf("unable to get session, %w", err))
		}
		sess.Options = &sessions.Options{
			Path:     "/",
			MaxAge:   86400 * 365, // one year
			HttpOnly: true,
			Secure:   true,
		}
		sess.Values["uuid"] = u.Model.ID.String()
		if err := sess.Save(c.Request(), c.Response()); err != nil {
			return echo.ErrInternalServerError.SetInternal(fmt.Errorf("unable to save session, %w", err))
		}

		return nil
	}
}

func (s server) sessionGet() echo.HandlerFunc {
	return func(c echo.Context) error {
		sess, err := session.Get(sessionKey, c)
		if err != nil {
			return echo.ErrInternalServerError.SetInternal(fmt.Errorf("unable to get session, %w", err))
		}
		return c.String(http.StatusOK, fmt.Sprint(sess.Values))
	}
}
