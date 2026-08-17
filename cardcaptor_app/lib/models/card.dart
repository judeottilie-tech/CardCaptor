class CardModel {
  final int id;
  final String name;
  final String imageUrl;
  final String rarity;
  final String types;
  final String category;
  final String setName;
  final String era;
  final String sourceId;

  CardModel({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.rarity,
    required this.types,
    required this.category,
    required this.setName,
    required this.era,
    required this.sourceId,
  });

  factory CardModel.fromJson(Map<String, dynamic> json) {
    return CardModel(
      id: json['id'],
      name: json['name'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      rarity: json['rarity'] ?? '',
      types: json['types'] ?? '',
      category: json['category'] ?? '',
      setName: json['setName'] ?? '',
      era: json['era'] ?? '',
      sourceId: json['sourceId'] ?? '',
    );
  }
}

class CardPage {
  final int totalCount;
  final List<CardModel> cards;

  CardPage({required this.totalCount, required this.cards});

  factory CardPage.fromJson(Map<String, dynamic> json) {
    return CardPage(
      totalCount: json['totalCount'] ?? 0,
      cards: (json['cards'] as List<dynamic>? ?? [])
          .map((c) => CardModel.fromJson(c))
          .toList(),
    );
  }
}
