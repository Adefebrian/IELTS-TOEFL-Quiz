"""
IELTS/TOEFL Quiz Practice Application

A command-line quiz application that loads questions from CSV files,
tracks progress across sessions, and provides practice modes for
answered and unanswered questions.

Author: Created for IELTS/TOEFL practice
"""

import csv
import json
import random
import os
from pathlib import Path
from typing import Dict, List, Optional, Set


class Question:
    
    def __init__(self, row: Dict[str, str]):
        self.id = int(row['id'])
        self.category = row['category']
        self.question = row['question']
        self.options = {
            'A': row['option_a'],
            'B': row['option_b'],
            'C': row['option_c'],
            'D': row['option_d']
        }
        self.correct_letter = row['correct_letter'].upper()
        self.correct_answer = row['correct_answer']
        self.explanation = row['explanation_id']
    
    def to_dict(self) -> Dict:
        """Convert question to dictionary format."""
        return {
            'id': self.id,
            'category': self.category,
            'question': self.question,
            'options': self.options,
            'correct_letter': self.correct_letter,
            'correct_answer': self.correct_answer,
            'explanation': self.explanation
        }


class QuestionManager:
    
    def __init__(self):
        self.questions: List[Question] = []
        self.questions_by_id: Dict[int, Question] = {}
    
    def load_questions(self, csv_files: List[str]) -> bool:
    
        total_loaded = 0
        
        for csv_file in csv_files:
            if not os.path.exists(csv_file):
                print(f"❌ Error: File '{csv_file}' tidak ditemukan!")
                return False
            
            try:
                with open(csv_file, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    count = 0
                    for row in reader:
                        question = Question(row)
                        self.questions.append(question)
                        self.questions_by_id[question.id] = question
                        count += 1
                    print(f"✓ Berhasil memuat {count} soal dari {csv_file}")
                    total_loaded += count
            except Exception as e:
                print(f"❌ Error membaca {csv_file}: {e}")
                return False
        
        print(f"\n📚 Total soal yang dimuat: {total_loaded}\n")
        return total_loaded > 0
    
    def get_unanswered_questions(self, answered_ids: Set[int]) -> List[Question]:
        return [q for q in self.questions if q.id not in answered_ids]
    
    def get_answered_questions(self, answered_ids: Set[int]) -> List[Question]:

        return [q for q in self.questions if q.id in answered_ids]
    
    def get_random_question(self, question_pool: List[Question]) -> Optional[Question]:

        if not question_pool:
            return None
        return random.choice(question_pool)


class QuizState:

    
    def __init__(self, state_file: str = "quiz_state.json"):
        self.state_file = state_file
        self.answered_ids: Set[int] = set()
    
    def load(self) -> bool:
        """Load state from JSON file."""
        if not os.path.exists(self.state_file):
            return True  # No state file yet, start fresh
        
        try:
            with open(self.state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.answered_ids = set(data.get('answered_ids', []))
            return True
        except json.JSONDecodeError:
            print(f"⚠️  File {self.state_file} rusak. Memulai dengan status baru.")
            self.answered_ids = set()
            return True
        except Exception as e:
            print(f"⚠️  Error membaca status: {e}. Memulai dengan status baru.")
            self.answered_ids = set()
            return True
    
    def save(self) -> bool:
        """Save state to JSON file."""
        try:
            data = {'answered_ids': list(self.answered_ids)}
            with open(self.state_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"⚠️  Error menyimpan status: {e}")
            return False
    
    def mark_answered(self, question_id: int):
        """Mark a question as answered."""
        self.answered_ids.add(question_id)
        self.save()
    
    def reset(self):
        """Reset all answered questions."""
        self.answered_ids.clear()
        self.save()
    
    def get_progress(self, total_questions: int) -> str:
        """Get progress string."""
        answered_count = len(self.answered_ids)
        return f"{answered_count}/{total_questions}"


class QuizApp:
    """Main quiz application."""
    
    def __init__(self):
        self.question_manager = QuestionManager()
        self.state = QuizState()
    
    def initialize(self) -> bool:
        """Initialize the application by loading questions and state."""
        print("=" * 50)
        print("     LATIHAN IELTS/TOEFL QUIZ")
        print("=" * 50)
        print("\nMemuat data soal...\n")
        
        # Load questions from both CSV files
        csv_files = ['quiz_batch1_2000.csv', 'quiz_batch2_2000.csv']
        if not self.question_manager.load_questions(csv_files):
            return False
        
        # Load state
        self.state.load()
        
        return True
    
    def display_main_menu(self):
        """Display the main menu."""
        total_questions = len(self.question_manager.questions)
        progress = self.state.get_progress(total_questions)
        
        print("\n" + "=" * 50)
        print("     LATIHAN IELTS/TOEFL QUIZ")
        print("=" * 50)
        print(f"Progress: {progress} soal telah dikerjakan\n")
        print("1. Mulai latihan (soal yang belum dikerjakan)")
        print("2. Latihan yang sudah dikerjakan")
        print("3. Reset status semua soal")
        print("0. Keluar")
        print("=" * 50)
    
    def get_menu_choice(self) -> str:
        """Get menu choice from user."""
        while True:
            choice = input("Pilihan kamu: ").strip()
            if choice in ['0', '1', '2', '3']:
                return choice
            print("⚠️  Pilihan tidak valid. Silakan pilih 0, 1, 2, atau 3.")
    
    def display_question(self, question: Question):
        """Display a question with all its options."""
        print("\n" + "=" * 70)
        print(f"ID: {question.id} | Kategori: {question.category}")
        print("=" * 70)
        print(f"\n{question.question}\n")
        print("-" * 70)
        for letter in ['A', 'B', 'C', 'D']:
            print(f"{letter}. {question.options[letter]}")
        print("-" * 70)
    
    def get_answer(self) -> str:
        """Get user's answer choice."""
        while True:
            answer = input("\nJawaban kamu (A/B/C/D): ").strip().upper()
            if answer in ['A', 'B', 'C', 'D']:
                return answer
            print("⚠️  Jawaban tidak valid. Silakan pilih A, B, C, atau D.")
    
    def show_result(self, question: Question, user_answer: str):
        """Show the result of the user's answer."""
        is_correct = user_answer == question.correct_letter
        
        print("\n" + "=" * 70)
        if is_correct:
            print("✅ BENAR!")
        else:
            print("❌ SALAH!")
        
        print(f"\nJawaban kamu: {user_answer}")
        print(f"Jawaban yang benar: {question.correct_letter} — {question.correct_answer}")
        print(f"\n💡 Penjelasan:")
        print(f"{question.explanation}")
        print("=" * 70)
    
    def ask_continue(self) -> bool:
        """Ask if user wants to continue."""
        while True:
            choice = input("\nLanjut ke soal berikutnya? (y/n): ").strip().lower()
            if choice == 'y':
                return True
            elif choice == 'n':
                return False
            print("⚠️  Silakan ketik 'y' untuk lanjut atau 'n' untuk kembali ke menu.")
    
    def run_unanswered_mode(self):
        """Run practice mode for unanswered questions."""
        unanswered = self.question_manager.get_unanswered_questions(self.state.answered_ids)
        
        if not unanswered:
            print("\n🎉 Selamat! Kamu sudah mengerjakan semua soal!")
            print("\nKamu bisa:")
            print("- Pilih menu '2' untuk latihan ulang soal yang sudah dikerjakan")
            print("- Pilih menu '3' untuk reset dan mulai dari awal")
            input("\nTekan Enter untuk kembali ke menu...")
            return
        
        print(f"\n📝 Ada {len(unanswered)} soal yang belum dikerjakan.\n")
        
        while unanswered:
            question = self.question_manager.get_random_question(unanswered)
            if not question:
                break
            
            self.display_question(question)
            user_answer = self.get_answer()
            self.show_result(question, user_answer)
            
            # Mark as answered
            self.state.mark_answered(question.id)
            
            # Remove from current pool
            unanswered = [q for q in unanswered if q.id != question.id]
            
            if not unanswered:
                print("\n🎉 Kamu sudah menyelesaikan semua soal yang tersisa!")
                input("\nTekan Enter untuk kembali ke menu...")
                break
            
            if not self.ask_continue():
                break
    
    def run_answered_mode(self):
        """Run practice mode for already answered questions."""
        answered = self.question_manager.get_answered_questions(self.state.answered_ids)
        
        if not answered:
            print("\n⚠️  Belum ada soal yang dikerjakan.")
            print("Silakan pilih menu '1' untuk mulai latihan.")
            input("\nTekan Enter untuk kembali ke menu...")
            return
        
        print(f"\n📚 Ada {len(answered)} soal yang sudah pernah dikerjakan.\n")
        
        while True:
            question = self.question_manager.get_random_question(answered)
            if not question:
                break
            
            self.display_question(question)
            user_answer = self.get_answer()
            self.show_result(question, user_answer)
            
            if not self.ask_continue():
                break
    
    def reset_progress(self):
        """Reset all progress after confirmation."""
        print("\n" + "=" * 70)
        print("⚠️  PERINGATAN: Ini akan menghapus semua progress yang sudah kamu kerjakan!")
        print("=" * 70)
        confirmation = input("\nKetik 'YA' untuk konfirmasi reset: ").strip()
        
        if confirmation == 'YA':
            self.state.reset()
            print("\n✅ Status semua soal berhasil direset!")
            print("Kamu bisa mulai latihan dari awal lagi.")
        else:
            print("\n❌ Reset dibatalkan.")
        
        input("\nTekan Enter untuk kembali ke menu...")
    
    def run(self):
        """Main application loop."""
        if not self.initialize():
            print("\n❌ Gagal menginisialisasi aplikasi.")
            print("Pastikan file CSV ada di folder yang sama dengan script ini.")
            return
        
        try:
            while True:
                self.display_main_menu()
                choice = self.get_menu_choice()
                
                if choice == '0':
                    print("\n👋 Terima kasih sudah berlatih! Semangat belajar!")
                    break
                elif choice == '1':
                    self.run_unanswered_mode()
                elif choice == '2':
                    self.run_answered_mode()
                elif choice == '3':
                    self.reset_progress()
        
        except KeyboardInterrupt:
            print("\n\n👋 Program dihentikan. Sampai jumpa!")
        except Exception as e:
            print(f"\n❌ Terjadi error: {e}")
            print("Silakan restart aplikasi.")


def main():
    """Entry point of the application."""
    app = QuizApp()
    app.run()


if __name__ == "__main__":
    main()
