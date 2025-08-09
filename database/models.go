package database

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Model struct {
	ID        uuid.UUID `gorm:"primaryKey;type=uuid"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (m *Model) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}

type User struct {
	Model

	Name         string `gorm:"unique;not null"`
	PasswordHash string
	IsAdmin      bool
}

type List struct {
	Model

	Entries []Entry
}

type Entry struct {
	Model

	Name   string
	Number string

	Bought bool

	TypeID string
	Type   Type `json:"-"`

	ListID uuid.UUID
}

func (e *Entry) BeforeCreate(tx *gorm.DB) error {
	if err := e.Model.BeforeCreate(tx); err != nil {
		return err
	}
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	if e.TypeID == "" {
		e.TypeID = "unknown"
	}
	return nil
}

type Type struct {
	Name string `gorm:"primaryKey"`
	Icon string
}
