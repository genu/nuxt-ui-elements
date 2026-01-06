/**
 * Standard utility library
 *
 * @example
 * import std from '#std'
 *
 * const text = std.plur('item', count)
 * const slug = std.slugify('Hello World')
 * const nextMonth = std.date.add(std.date.today(), 1, 'month')
 */

import plur from "plur"
import slugify from "@sindresorhus/slugify"
import * as date from "./std/date"

export default {
  plur,
  slugify,
  date,
} as const
