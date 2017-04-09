package main

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)

func main() {
	// create an aws session
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("us-east-1"),
	}))

	svc := cognitoidentityprovider.New(sess)

	appClientID := "6uftii08ljg6n8ml6eu6qitb0c" // FitHub Mobile
	email := "markus.craig@gmail.com"
	pass := "Testing123$"

	params := &cognitoidentityprovider.SignUpInput{
		ClientId: aws.String(appClientID),
		Username: aws.String(email),
		Password: aws.String(pass),
		UserAttributes: []*cognitoidentityprovider.AttributeType{
			{
				Name:  aws.String("email"),
				Value: aws.String(email),
			},
		},
		/*
			ValidationData: []*cognitoidentityprovider.AttributeType{
				{ // Required
					Name:  aws.String("AttributeNameType"), // Required
					Value: aws.String("AttributeValueType"),
				},
				// More values...
			},
		*/
	}
	resp, err := svc.SignUp(params)

	if err != nil {
		// Print the error, cast err to awserr.Error to get the Code and
		// Message from an error.
		fmt.Println(err.Error())
		return
	}

	// Pretty-print the response data.
	fmt.Println(resp)
}
