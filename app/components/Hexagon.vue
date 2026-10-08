<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    radius?: number
  }>(),
  { radius: 6 }
)

// Height of a regular pointy-top hexagon in a 100-wide box
const H = 200 / Math.sqrt(3)

type Point = [number, number]

const path = computed(() => {
  const r = props.radius
  const pts: Point[] = [
    [50, 0],
    [100, H / 4],
    [100, (H * 3) / 4],
    [50, H],
    [0, (H * 3) / 4],
    [0, H / 4]
  ]

  const toward = (a: Point, b: Point): Point => {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dx, dy)
    const d = Math.min(r, len / 2)
    return [a[0] + (dx / len) * d, a[1] + (dy / len) * d]
  }

  const f = (p: Point) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`

  return (
    pts
      .map((cur, i) => {
        const prev = pts[(i + 5) % 6]!
        const next = pts[(i + 1) % 6]!
        return `${i === 0 ? 'M' : 'L'} ${f(toward(cur, prev))} Q ${f(cur)} ${f(toward(cur, next))}`
      })
      .join(' ') + ' Z'
  )
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div
    class="relative"
    :style="{ aspectRatio: `100 / ${H}` }"
  >
    <svg
      :viewBox="`0 0 100 ${H}`"
      class="absolute inset-0 size-full overflow-visible"
      ds
      aria-hidden="true"
    >

      <!-- classes are hardcoded for now. This is just a hacky hex.
      fill-card stroke-default stroke-2 -->

      <path
        class="fill-card stroke-default stroke-[1.5]"
        :d="path"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>
    <div class="relative z-10 flex size-full items-center justify-center">
      <slot />
    </div>
  </div>
</template>
