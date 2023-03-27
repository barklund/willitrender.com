import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const exercises = [
    {
      round: 1,
      repoName: "render-champion-01",
      correct: 0,
      seconds: 600,
      explanation: "The button doesn't do anything, so nothing renders.",
    },
    {
      round: 2,
      repoName: "render-champion-02",
      correct: 15,
      seconds: 30,
      explanation:
        "The app re-renders because the state is updated, so all components inside it re-render.",
    },
    {
      round: 3,
      repoName: "render-champion-03",
      correct: 0,
      seconds: 30,
      explanation:
        "The app doesn't re-render, because the state is set to what it already was, so nothing renders.",
    },
    {
      round: 4,
      repoName: "render-champion-04",
      correct: 0,
      seconds: 30,
      explanation:
        "Even though the parent HTML elements of the squares re-render, due to React component hierarchy, the squares actually don't re-render.",
    },
    {
      round: 5,
      repoName: "render-champion-05",
      correct: 3,
      seconds: 30,
      explanation:
        "The memoized squares don't re-render, because they're given the same props every time regardless of parent component render",
    },
    {
      round: 6,
      repoName: "render-champion-06",
      correct: 8,
      seconds: 30,
      explanation:
        "If amy property passed to a memoized component changes between renders, the component will render. Even if the components doesn't actually use the property.",
    },
    {
      round: 7,
      repoName: "render-champion-07",
      correct: 10,
      seconds: 30,
      explanation:
        "Functions and objects create inline in a component, will be recreated on every render, so even though they looksidentical on every render, they aren't",
    },
    {
      round: 8,
      repoName: "render-champion-08",
      correct: 9,
      seconds: 30,
      explanation:
        "If callbacks are properly memoized, they don't cause re-renders as long as the callback's dependencies don't change.",
    },
    {
      round: 9,
      repoName: "render-champion-09",
      correct: 0,
      seconds: 30,
      explanation:
        "A reducer that returns the same value again, also doesn't cause a re-render - just like useState.",
    },
    {
      round: 10,
      repoName: "render-champion-10",
      correct: 4,
      seconds: 30,
      explanation:
        "This time the reducer returns an object with properties, and because this object is re-created every time it updates, it will cause a re-render even though the properties of the reducer state don't actually change.",
    },
    {
      round: 11,
      repoName: "render-champion-11",
      correct: 15,
      seconds: 60,
      explanation:
        "We still update state in the app as usual, so the entire app re-renders. The context is actually just bait.",
    },
    {
      round: 12,
      repoName: "render-champion-12",
      correct: 15,
      seconds: 60,
      explanation:
        "All the components still render, because they're all defined inside the stateful component. Again, the context is kind of bait.",
    },
    {
      round: 13,
      repoName: "render-champion-13",
      correct: 14,
      seconds: 60,
      explanation:
        "With the provider defined in its own component, the main app doesn't re-render, so only context consumers re-render.",
    },
    {
      round: 14,
      repoName: "render-champion-14",
      correct: 5,
      seconds: 60,
      explanation:
        "Every context consumer componment re-renders when the context updates, regardless of which values they consume from the context.",
    },
    {
      round: 15,
      repoName: "render-champion-15",
      correct: 4,
      seconds: 240,
      explanation:
        "With useContextSelector, the context consumer component only re-renders, if the selected part of the context updates. This is how context was supposed to work IMO, but it isn't. Context selectors might be implemented natively in React in the future, but for now we have to rely on an",
    },
    {
      round: 16,
      repoName: "render-champion-16",
      correct: 3,
      seconds: 120,
      explanation:
        "When using useImperativeHandle, you must use the forwardedRef, otherwise it makes no sense.",
    },
    {
      round: 17,
      repoName: "render-champion-17",
      correct: 12,
      seconds: 120,
      explanation:
        "When returning an array of elements, that can be returned in different orders on different renders, make sure to set the key to something unique for the element, and not the index of the item. If you set it to the index, React will actually re-use a wrong component for the re-render defeating memoization.",
    },
    {
      round: 18,
      repoName: "render-champion-18",
      correct: 3,
      seconds: 120,
      explanation:
        "However, if the key's aren't reused at all, but completely new keys are used on a new render, the components are completly unmounted and remounted, so no re-render takes place again. Duplicate keys work just like index keys - reuse will be attempted, but might fail.",
    },
    {
      round: 19,
      repoName: "render-champion-19",
      correct: 3,
      seconds: 120,
      explanation:
        "Inline created components aren't re-rendered - they're completely remounted every time, thus completely destroying the old component, creating a new one.",
    },
    {
      round: 20,
      repoName: "render-champion-20",
      correct: 0,
      seconds: 120,
      explanation:
        "If fallback and suspense include the same component, will it re-render the same instance? No, when switching from the fallback to the now completed content, the fallback is fully unmounted before the content is shown, even if the two component trees have overlapping JSX elements. So no re-render takes place at all, all 4 squares are fully re-mounted.",
    },
  ];

  const game = await prisma.game.create({
    data: {
      name: "renderchampion",
      rounds: exercises.length,
    },
  });

  await Promise.all(
    exercises.map((exercise) =>
      prisma.exercise.create({ data: { ...exercise, gameId: game.id } })
    )
  );
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
