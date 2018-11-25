const HTTPDOMAIN = ''

const SESSION_KEYS = [
  "",
  "",
  ""
]

const MONGO_DATABASE = {
  USER: '',
  PASSWORD: '',
  NAME: '',
  URI: ''
}

module.exports = {
  SENDGRID_API_KEY: "",
  SESSION_KEYS,
  MONGO_DATABASE,
  HTTPDOMAIN,
  MONGOURI: `mongodb://${MONGO_DATABASE.USER}:${MONGO_DATABASE.PASSWORD}${MONGO_DATABASE.URI}/${MONGO_DATABASE.NAME}`,
  AUTH: {
    GOOGLE: {
      CLIENT_ID: '',
      SECRET: '',
      SCOPES: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
    },
    FACEBOOK: {
      APP_ID: '',
      SECRET: '',
      SCOPES: ['user_hometown']
    }
  }
}
