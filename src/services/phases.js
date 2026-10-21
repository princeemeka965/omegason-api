import { starterPhases } from '../data/phases.js'
import { ApiError } from '../errors.js'
import { plainText, slugify } from '../lib/text.js'
import { Phase, Story } from '../models.js'
import { presentPhase } from '../present.js'
import { imageValue } from './catalogue.js'

async function storiesFor(phaseId) {
  return Story.findAll({
    where: { phaseId },
    order: [
      ['position', 'ASC'],
      ['createdAt', 'ASC'],
    ],
  })
}

async function phaseRecord(id) {
  const phase = await Phase.findByPk(id)
  if (!phase) throw new ApiError(404, 'That phase was not found.')
  return phase
}

async function present(phase) {
  return presentPhase(phase, await storiesFor(phase.id))
}

export async function listPhases() {
  const phases = await Phase.findAll({
    order: [
      ['position', 'ASC'],
      ['createdAt', 'ASC'],
    ],
  })
  const stories = await Story.findAll({
    order: [
      ['position', 'ASC'],
      ['createdAt', 'ASC'],
    ],
  })
  const grouped = new Map()
  for (const story of stories) {
    const list = grouped.get(story.phaseId) || []
    list.push(story)
    grouped.set(story.phaseId, list)
  }
  return phases.map((phase) => presentPhase(phase, grouped.get(phase.id) || []))
}

export async function listPublicPhases() {
  const phases = await listPhases()
  return phases.filter((phase) => phase.published && phase.stories.length > 0)
}

async function uniqueSlug(name, ignoreId) {
  let slug = slugify(name) || `phase-${Date.now()}`
  const base = slug
  let n = 2
  while (true) {
    const taken = await Phase.findOne({ where: { slug } })
    if (!taken || taken.id === ignoreId) return slug
    slug = `${base}-${n++}`.slice(0, 80)
  }
}

function copyInput(value, { emptyMessage, limit, limitMessage, htmlLimit }) {
  const html = String(value || '').replace(/\r\n/g, '\n').trim()
  const text = plainText(html)
  if (!text) throw new ApiError(400, emptyMessage)
  if (text.length > limit) throw new ApiError(400, limitMessage)
  if (html.length > htmlLimit) throw new ApiError(400, limitMessage)
  return html
}

function phaseInput(input, current) {
  const name = String(input.name || '').trim()
  const headline = String(input.headline || '').trim()
  if (!name) throw new ApiError(400, 'Enter a phase name.')
  if (name.length > 80) throw new ApiError(400, 'Keep the phase name to 80 characters.')
  if (!headline) throw new ApiError(400, 'Enter the home page heading.')
  if (headline.length > 160) throw new ApiError(400, 'Keep the home page heading to 160 characters.')
  const lead = copyInput(input.lead, {
    emptyMessage: 'Enter the introduction shown on the projects page.',
    limit: 600,
    limitMessage: 'Keep the introduction to 600 characters.',
    htmlLimit: 8000,
  })
  const published = input.published === undefined ? (current ? current.published : true) : Boolean(input.published)
  return { name, headline, lead, published }
}

async function assertNameFree(name, ignoreId) {
  const phases = await Phase.findAll()
  if (phases.some((phase) => phase.id !== ignoreId && phase.name.toLowerCase() === name.toLowerCase())) {
    throw new ApiError(400, 'A phase with that name already exists.')
  }
}

async function nextPhasePosition() {
  const max = await Phase.max('position')
  return Number.isFinite(max) ? max + 1 : 0
}

export async function savePhase(input, id) {
  const current = id ? await phaseRecord(id) : null
  const next = phaseInput(input, current)
  await assertNameFree(next.name, current?.id)
  const row = current || Phase.build({ position: await nextPhasePosition() })
  Object.assign(row, next, { slug: await uniqueSlug(next.name, current?.id) })
  await row.save()
  return present(row)
}

export async function deletePhase(id) {
  const phase = await phaseRecord(id)
  await phase.destroy()
}

function storyInput(input, current) {
  const title = String(input.title || '').trim()
  const summary = String(input.summary || '').trim()
  if (!title) throw new ApiError(400, 'Enter a story title.')
  if (title.length > 160) throw new ApiError(400, 'Keep the title to 160 characters.')
  if (!summary) throw new ApiError(400, 'Enter a short summary.')
  if (summary.length > 280) throw new ApiError(400, 'Keep the summary to 280 characters.')
  const body = copyInput(input.body, {
    emptyMessage: 'Write the story.',
    limit: 8000,
    limitMessage: 'Keep the story under 8,000 characters.',
    htmlLimit: 40000,
  })
  const featured = input.featured === undefined ? (current ? current.featured : false) : Boolean(input.featured)
  return {
    title,
    summary,
    body,
    image: imageValue(input.image),
    featured,
  }
}

async function storyRecord(id) {
  const story = await Story.findByPk(id)
  if (!story) throw new ApiError(404, 'That story was not found.')
  return story
}

async function nextStoryPosition(phaseId) {
  const max = await Story.max('position', { where: { phaseId } })
  return Number.isFinite(max) ? max + 1 : 0
}

export async function saveStory(input, { phaseId, id } = {}) {
  const current = id ? await storyRecord(id) : null
  const phase = await phaseRecord(current ? current.phaseId : phaseId)
  const next = storyInput(input, current)
  const row = current || Story.build({ phaseId: phase.id, position: await nextStoryPosition(phase.id) })
  Object.assign(row, next)
  await row.save()
  return present(phase)
}

export async function deleteStory(id) {
  const story = await storyRecord(id)
  const phaseId = story.phaseId
  await story.destroy()
  return present(await phaseRecord(phaseId))
}

async function moveRows(rows, id, direction) {
  const index = rows.findIndex((row) => row.id === id)
  const target = direction === 'up' ? index - 1 : index + 1
  if (index < 0 || target < 0 || target >= rows.length) return false
  const [item] = rows.splice(index, 1)
  rows.splice(target, 0, item)
  await Promise.all(rows.map((row, position) => (row.position === position ? null : row.update({ position }))))
  return true
}

function directionOf(input) {
  const direction = input?.direction
  if (direction !== 'up' && direction !== 'down') throw new ApiError(400, 'Choose up or down.')
  return direction
}

export async function movePhase(id, input) {
  const direction = directionOf(input)
  await phaseRecord(id)
  const phases = await Phase.findAll({
    order: [
      ['position', 'ASC'],
      ['createdAt', 'ASC'],
    ],
  })
  await moveRows(phases, id, direction)
  return listPhases()
}

export async function moveStory(id, input) {
  const direction = directionOf(input)
  const story = await storyRecord(id)
  const stories = await storiesFor(story.phaseId)
  await moveRows(stories, id, direction)
  return present(await phaseRecord(story.phaseId))
}

export async function seedStarterPhases() {
  for (const [position, source] of starterPhases.entries()) {
    const phase = await Phase.create({
      slug: await uniqueSlug(source.name),
      name: source.name,
      headline: source.headline,
      lead: source.lead,
      published: true,
      position,
    })
    await Story.bulkCreate(
      source.stories.map((story, index) => ({
        phaseId: phase.id,
        title: story.title,
        summary: story.summary,
        body: story.body,
        image: story.image,
        featured: story.featured,
        position: index,
      })),
    )
  }
}
