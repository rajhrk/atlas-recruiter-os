import { RecruiterKnowledgeTopic } from "./types";
import { upsKnowledge } from "./ups";

const knowledgeTopics: RecruiterKnowledgeTopic[] = [
  upsKnowledge,
];

export function getKnowledgeTopic(id: string) {
  return knowledgeTopics.find(
    (topic) => topic.id.toLowerCase() === id.toLowerCase()
  );
}

export function getAllKnowledgeTopics() {
  return knowledgeTopics;
}