<script setup lang="ts">
  import { kebabCase } from "scule"
  import type { ContentNavigationItem } from "@nuxt/content"

  const route = useRoute()

  definePageMeta({
    layout: "docs",
  })

  const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection("docs").path(route.path).first())

  if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true })
  }

  const navigation = inject<Ref<ContentNavigationItem[]>>("navigation")

  const { findSurround, findBreadcrumb } = useNavigation(navigation!)

  const breadcrumb = computed(() => findBreadcrumb(page.value?.path as string))
  const surround = computed(() => findSurround(page.value?.path as string))

  const title = page.value?.navigation?.title || page.value?.title
  const description = page.value?.description

  useSeoMeta({
    titleTemplate: "%s - Nuxt UI Elements",
    title,
    ogTitle: `${title} - Nuxt UI Elements`,
    description,
    ogDescription: description,
  })

  const communityLinks = computed(() => [
    {
      icon: "i-lucide-file-pen",
      label: "Edit this page",
      to: `https://github.com/genu/nuxt-ui-elements/edit/main/docs/content/${page?.value?.stem}.md`,
      target: "_blank",
    },
    {
      icon: "i-lucide-star",
      label: "Star on GitHub",
      to: `https://github.com/genu/nuxt-ui-elements`,
      target: "_blank",
    },
  ])
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title">
      <template #headline>
        <UBreadcrumb :items="breadcrumb" />
      </template>

      <template #description>
        <MDC v-if="page.description" :value="page.description" unwrap="p" :cache-key="`${kebabCase(route.path)}-description`" />
      </template>

      <template v-if="page.links?.length" #links>
        <UButton
          v-for="link in page.links"
          :key="link.label"
          color="neutral"
          variant="outline"
          :target="link.to?.startsWith('http') ? '_blank' : undefined"
          v-bind="link" />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator v-if="surround?.filter(Boolean).length" />

      <UContentSurround :surround="surround as any" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links" class="z-[2]">
        <template #bottom>
          <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />

          <UPageLinks title="Community" :links="communityLinks" />
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
