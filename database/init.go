package database

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Init(dsn string) (*gorm.DB, error) {
	dialector := sqlite.Open(dsn)

	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("unable to open database, %w", err)
	}

	err = db.AutoMigrate(&Entry{}, &Type{}, &List{})
	if err != nil {
		return nil, fmt.Errorf("unable to migrate database models, %w", err)
	}

	// types to database
	types := []Type{
		{Name: "fruit", Icon: "🍎"},
		{Name: "vegetable", Icon: "🥦"},
		{Name: "drink", Icon: "🍹"},
		{Name: "meat", Icon: "🍖"},
		{Name: "snack", Icon: "🍿"},
		{Name: "dairy", Icon: "🧀"},
		{Name: "bread", Icon: "🥖"},
		{Name: "condiment", Icon: "🧂"},
		{Name: "frozen", Icon: "❄️"},
		{Name: "canned", Icon: "🥫"},
		{Name: "spice", Icon: "🌶️"},
		{Name: "unknown", Icon: "🤷‍♀️"},
	}
	for _, t := range types {
		if err := db.Save(&t).Error; err != nil {
			return nil, fmt.Errorf("unable to create default type '%s' in database, %w", t.Name, err)
		}
	}

	return db, nil
}
