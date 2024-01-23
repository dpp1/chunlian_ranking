from abc import ABCMeta, abstractmethod


class LLMInterface(metaclass=ABCMeta):
    @abstractmethod
    def couplet_master(self, prompt: str) -> str:
        ...
