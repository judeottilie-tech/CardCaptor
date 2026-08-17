import 'card.dart';

class BinderPageCardSlot {
  final int id;
  final int position;
  final int binderPageId;
  final int? cardId;
  final CardModel? card;

  BinderPageCardSlot({
    required this.id,
    required this.position,
    required this.binderPageId,
    this.cardId,
    this.card,
  });

  factory BinderPageCardSlot.fromJson(Map<String, dynamic> json) {
    return BinderPageCardSlot(
      id: json['id'],
      position: json['position'],
      binderPageId: json['binderPageId'],
      cardId: json['cardId'],
      card: json['card'] != null ? CardModel.fromJson(json['card']) : null,
    );
  }
}
