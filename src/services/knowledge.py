"""Knowledge and learning stubs."""
from typing import Dict, Any


class KnowledgeService:
    def document_center(self, query: str) -> Dict[str, Any]:
        return {"action": "document_center", "query": query}

    def faq(self, question: str) -> Dict[str, Any]:
        return {"action": "faq", "question": question}

    def tag(self, article_id: int, tag: str) -> Dict[str, Any]:
        return {"action": "knowledge_tag", "article_id": article_id, "tag": tag}

    def search(self, keyword: str) -> Dict[str, Any]:
        return {"action": "search", "keyword": keyword}


class LearningService:
    def course(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "course", "payload": payload}

    def video(self, course_id: int) -> Dict[str, Any]:
        return {"action": "video", "course_id": course_id}

    def progress(self, user_id: int, course_id: int) -> Dict[str, Any]:
        return {"action": "progress", "user_id": user_id, "course_id": course_id}

    def exam(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "exam", "payload": payload}

    def certificate(self, user_id: int, course_id: int) -> Dict[str, Any]:
        return {"action": "certificate", "user_id": user_id, "course_id": course_id}
