import { Form, useLoaderData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { joinSession } from "~/models/session.server";
import { sendJoin } from "~/services/pusher.server";

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const shortcode = body.get("shortcode");
  const nickname = body.get("nickname");
  const seniority = parseInt(String(body.get("seniority")) || "");
  const emoji = body.get("emoji") || body.get("custom-emoji");
  if (
    typeof shortcode !== "string" ||
    typeof nickname !== "string" ||
    typeof emoji !== "string" ||
    isNaN(seniority)
  ) {
    return json({ error: "Missing input" });
  }
  const participant = await joinSession({
    emoji,
    nickname,
    seniority,
    shortcode,
  });
  await sendJoin(shortcode, participant);
  return redirect(`/game/guess/${participant.session.id}/${participant.id}`);
}

const EMOJIS = [
  { emoji: "🧀", name: "Cheese" },
  { emoji: "🎯", name: "Direct hit" },
  { emoji: "🔮", name: "Crystal ball" },
  { emoji: "🛸", name: "Flying saucer" },
  { emoji: "🎲", name: "Game die" },
  { emoji: "📯", name: "Horn" },
  { emoji: "🕰️", name: "Mantelpiece clock" },
  { emoji: "🎧", name: "Headphone" },
  { emoji: "🚽", name: "Toilet" },
  { emoji: "🧻", name: "Toilet paper" },
  { emoji: "🪴", name: "Potted plant" },
  { emoji: "🌶️", name: "Hot pepper" },
  { emoji: "🧹", name: "Broom" },
  { emoji: "🦐", name: "Shrimp" },
  { emoji: "🐌", name: "Snail" },
  { emoji: "🌵", name: "Cactus" },
  { emoji: "🦄", name: "Unicorn" },
  { emoji: "🪵", name: "Wood" },
  { emoji: "🦑", name: "Squid" },
  { emoji: "🍆", name: "Eggplant" },
  { emoji: "🪴", name: "Potted plant" },
  { emoji: "🌮", name: "Taco" },
  { emoji: "🦐", name: "Shrimp" },
  { emoji: "🪱", name: "Worm" },
  { emoji: "🦖", name: "T-Rex" },
  { emoji: "🎈", name: "Balloon" },
  { emoji: "🪞", name: "Mirror" },
  { emoji: "🦔", name: "Hedgehog" },
  { emoji: "🌯", name: "Burrito" },
  { emoji: "🎁", name: "Wrapped gift" },
  { emoji: "🎮", name: "Video game" },
  { emoji: "🔑", name: "Key" },
  { emoji: "🕸️", name: "Spider web" },
  { emoji: "🧊", name: "Ice" },
  { emoji: "🦩", name: "Flamingo" },
  { emoji: "🔭", name: "Telescope" },
  { emoji: "🪐", name: "Ringed planet" },
  { emoji: "🔪", name: "Kitchen knife" },
  { emoji: "🎃", name: "Jack-O'-Lantern" },
  { emoji: "🌭", name: "Hot dog" },
  { emoji: "🍍", name: "Pineapple" },
  { emoji: "🍔", name: "Hamburger" },
];

export async function loader() {
  const random = EMOJIS.slice().sort(() => Math.random() - 0.5);
  const emojis = random.slice(0, 4);
  return json({ emojis });
}

export default function Join() {
  const { emojis } = useLoaderData<typeof loader>();
  return (
    <>
      <Form
        method="post"
        className="mx-auto my-12 flex w-1/2 flex-col gap-4 border border-purple-400 p-4 "
      >
        <label className="flex flex-col gap-2">
          Session code:
          <input className="w-40 border px-1" name="shortcode" maxLength={4} />
        </label>
        <label className="flex flex-col gap-2">
          <span>
            Nickname <small>(max 8 characters)</small>:
          </span>
          <input className="w-40 border px-1" name="nickname" maxLength={8} />
        </label>
        <div className="flex flex-col gap-2">
          <span>
            Seniority <small>(please be honest)</small>:
          </span>
          <div className="flex gap-4">
            <label>
              <input type="radio" name="seniority" value="1" /> Junior/Student
            </label>
            <label>
              <input type="radio" name="seniority" value="2" /> Midlevel
            </label>
            <label>
              <input type="radio" name="seniority" value="3" /> Senior/Lead
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          Emoji:
          {emojis.map(({ emoji, name }) => (
            <label key={emoji}>
              <input type="radio" name="emoji" value={emoji} /> {emoji}{" "}
              <small>({name})</small>
            </label>
          ))}
          <label>
            <input type="radio" name="emoji" value="" />{" "}
            <input
              className="w-16 border px-1"
              name="custom-emoji"
              placeholder="custom"
              maxLength={1}
            />
          </label>
        </div>
        <button className="bg-purple-500 py-2 text-white">Start</button>
      </Form>
    </>
  );
}
