import { DataTypes } from 'sequelize'
import { sequelize } from './db.js'

export const Admin = sequelize.define(
  'Admin',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false, defaultValue: '' },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(120), allowNull: false },
  },
  { tableName: 'admins' },
)

export const Category = sequelize.define(
  'Category',
  {
    id: { type: DataTypes.STRING(80), primaryKey: true },
    label: { type: DataTypes.STRING(120), allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: 'categories', updatedAt: false },
)

export const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    summary: { type: DataTypes.STRING(180), allowNull: false },
    descriptionHtml: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    specificationsHtml: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    price: { type: DataTypes.INTEGER, allowNull: true },
    image: { type: DataTypes.TEXT, allowNull: true },
    featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { tableName: 'products' },
)

export const Quote = sequelize.define(
  'Quote',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false },
    phone: { type: DataTypes.STRING(40), allowNull: false, defaultValue: '' },
    state: { type: DataTypes.STRING(80), allowNull: false, defaultValue: '' },
    subject: { type: DataTypes.STRING(200), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    productSlug: { type: DataTypes.STRING(80), allowNull: false, defaultValue: '' },
    productName: { type: DataTypes.STRING(160), allowNull: false, defaultValue: '' },
    productImage: { type: DataTypes.TEXT, allowNull: true },
    kind: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'general' },
    read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    destinationEmail: { type: DataTypes.STRING(160), allowNull: true },
    reply: { type: DataTypes.TEXT, allowNull: true },
    repliedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'quotes', updatedAt: false },
)

export const Setting = sequelize.define(
  'Setting',
  {
    key: { type: DataTypes.STRING(80), primaryKey: true },
    value: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  },
  { tableName: 'settings', timestamps: false },
)

export const OtpChallenge = sequelize.define(
  'OtpChallenge',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    codeHash: { type: DataTypes.STRING(64), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: 'otp_challenges', updatedAt: false },
)

export const Phase = sequelize.define(
  'Phase',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(80), allowNull: false },
    headline: { type: DataTypes.STRING(160), allowNull: false },
    lead: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: 'phases' },
)

export const Story = sequelize.define(
  'Story',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(160), allowNull: false },
    summary: { type: DataTypes.STRING(280), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    image: { type: DataTypes.TEXT, allowNull: true },
    featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: 'phase_stories' },
)

export const Post = sequelize.define(
  'Post',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    title: { type: DataTypes.STRING(160), allowNull: false },
    excerpt: { type: DataTypes.STRING(300), allowNull: false, defaultValue: '' },
    body: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    coverImage: { type: DataTypes.TEXT, allowNull: true },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'posts' },
)

Category.hasMany(Product, { foreignKey: { name: 'categoryId', allowNull: false }, onDelete: 'RESTRICT' })
Product.belongsTo(Category, { foreignKey: 'categoryId' })
Phase.hasMany(Story, { as: 'stories', foreignKey: { name: 'phaseId', allowNull: false }, onDelete: 'CASCADE' })
Story.belongsTo(Phase, { as: 'phase', foreignKey: 'phaseId' })

export const AccountChange = sequelize.define(
  'AccountChange',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    codeHash: { type: DataTypes.STRING(64), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false },
    passwordHash: { type: DataTypes.STRING(120), allowNull: true },
    quotesEmail: { type: DataTypes.STRING(160), allowNull: true },
  },
  { tableName: 'account_changes', updatedAt: false },
)

Admin.hasMany(OtpChallenge, { foreignKey: { name: 'adminId', allowNull: false }, onDelete: 'CASCADE' })
OtpChallenge.belongsTo(Admin, { foreignKey: 'adminId' })
Admin.hasMany(AccountChange, { foreignKey: { name: 'adminId', allowNull: false }, onDelete: 'CASCADE' })
AccountChange.belongsTo(Admin, { foreignKey: 'adminId' })
